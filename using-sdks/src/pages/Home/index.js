import {
  ref,
  listAll,
  getMetadata,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../utils/firebaseApp";
import List from "./List";
import { uploadSVG } from "../../assets/icons";

import AddressBar from "../../components/AddressBar";
import RenamingModal from "./RenamingModal";
import { rename } from "../../apis";

import spinner from "../../components/Spinner";
import { IDLE, IS_DELETING, JUST_UPLOADED } from "../../messages";

function Home() {
  const [list, setList] = useState([]);
  const [folderLocation, setFolderLocation] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [inputKey, setInputKey] = useState(1);
  const [renamingItem, setRenamingItem] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const onGetInsideFolder = (item) => {
    setFolderLocation(item._location.path);
  };

  const moveLocationHandler = (path) => {
    setFolderLocation(path);
  };

  const changeFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const item of files) {
      const fileName = item.name;
      if (
        list.some((item) => item._location.path.split("/").at(-1) === fileName)
      ) {
        if (!window.confirm(`Do you want to replace ${fileName}?`)) {
          setUploadFiles([]);
          setInputKey((prev) => prev + 1);
          console.log("exit");
          return;
        }
      }
    }

    console.log("still run");
    setUploadFiles(
      files.map((file) => ({
        file: file,
        ref: ref(storage, folderLocation + "/" + file.name),
        error: null,
        status: "idle",
      }))
    );
  };

  const clickDeleteHandler = (item) => {
    if (
      window.confirm(`Are you sure wanting to delete "${item._location.path}"`)
    ) {
      setList((prev) => {
        return prev.map((listItem) =>
          listItem._location.path === item._location.path
            ? { ...listItem, status: IS_DELETING }
            : listItem
        );
      });

      deleteObject(ref(storage, item._location.path))
        .then(() => {
          setList((prev) => {
            return prev.filter(
              (listItem) => listItem._location.path !== item._location.path
            );
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  const clickRenameHandler = (item) => {
    setRenamingItem(item);
  };

  const quitRenameHandler = () => {
    setRenamingItem(null);
  };

  const renameHandler = async (item, newName) => {
    // check already exist filename
    if (list.some((listItem) => listItem.metadata?.name === newName)) {
      alert(`This name "${newName}" already exists. `);
      return;
    }

    const newRef = ref(ref(storage, item._location.path).parent, newName);
    try {
      setIsRenaming(true);
      const res = await rename(item._location.path, newRef._location.path);

      if (!res.ok)
        throw new Error(
          "I don't know what happened. Check the network tab in F12."
        );

      const newUrl = await getDownloadURL(newRef);

      setList((prev) =>
        prev.map((listItem) =>
          listItem._location.path === item._location.path
            ? { ...listItem, ...newRef, url: newUrl }
            : listItem
        )
      );
      setRenamingItem(null);
      setIsRenaming(false);
    } catch (error) {
      setIsRenaming(false);
      alert(error.message);
    }
  };

  const isUploading = uploadFiles.some(
    (uploadFile) => uploadFile.status === "pending"
  );

  // fetch list
  useEffect(() => {
    const listRef = ref(storage, folderLocation);
    setIsFetching(true);
    listAll(listRef).then(async (res) => {
      const fileMetadatas = await Promise.all(
        res.items.map((file) => getMetadata(ref(storage, file._location.path)))
      );

      const urls = await Promise.all(
        res.items.map((file) =>
          getDownloadURL(ref(storage, file._location.path))
        )
      );

      const files = res.items.map((item, index) => ({
        ...item,
        metadata: fileMetadatas[index],
        isDeleting: false,
        isRenaming: false,
        status: IDLE,
        url: urls[index],
      }));
      const folders = res.prefixes.map((folder) => ({
        ...folder,
        isDeleting: false,
        isRenaming: false,
        status: IDLE,
      }));

      setList([...folders, ...files]);
      setIsFetching(false);
    });
  }, [folderLocation]);

  // upload files
  useEffect(() => {
    if (uploadFiles === 0) return;

    uploadFiles.forEach((uploadFile) => {
      if (uploadFile.status !== "idle") return;

      setUploadFiles((prev) =>
        prev.map((item) =>
          item.file.name == uploadFile.file.name
            ? { ...item, status: "pending" }
            : item
        )
      );

      uploadBytes(uploadFile.ref, uploadFile.file)
        .then((result) => {
          setUploadFiles((prev) =>
            prev.map((item) =>
              item.file.name == uploadFile.file.name
                ? { ...item, status: "succeeded" }
                : item
            )
          );
          setList((prev) => {
            const replacedItem = prev.find(
              (item) => item._location.path === result.ref._location.path
            );
            if (replacedItem)
              return prev.map((item) =>
                item._location.path === result.ref._location.path
                  ? {
                      metadata: result.metadata,
                      ...result.ref,
                      status: JUST_UPLOADED,
                    }
                  : item
              );
            return [
              ...prev,
              {
                metadata: result.metadata,
                ...result.ref,
                status: JUST_UPLOADED,
              },
            ];
          });
        })
        .catch((error) => {
          setUploadFiles((prev) =>
            prev.map((item) =>
              item.file.name == uploadFile.file.name
                ? { ...item, error: error, status: "failed" }
                : item
            )
          );
        });
    });
  }, [uploadFiles]);

  useEffect(() => {
    console.log(list);
  }, [list]);

  return (
    <div className="">
      <div className="py-2 border-bottom d-flex justify-content-between align-items-center">
        <AddressBar
          stringAddress={folderLocation}
          onMoveLocation={moveLocationHandler}
        />

        <label className="uploadIcon">
          {!isUploading && uploadSVG}
          {isUploading && spinner}
          <input
            type="file"
            onChange={changeFileHandler}
            multiple
            key={inputKey}
          />
        </label>
      </div>

      {!isFetching && (
        <List
          list={list}
          onGetInsideFolder={onGetInsideFolder}
          onClickDelete={clickDeleteHandler}
          onClickRename={clickRenameHandler}
        />
      )}

      {isFetching && (
        <div className="d-flex align-items-center justify-content-center p-5">
          {spinner}
        </div>
      )}

      {renamingItem && (
        <RenamingModal
          item={renamingItem}
          onRename={renameHandler}
          onQuit={quitRenameHandler}
          isRenaming={isRenaming}
        />
      )}
    </div>
  );
}

export default Home;
