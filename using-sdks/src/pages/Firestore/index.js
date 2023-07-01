import { useEffect, useState } from "react";
import { db } from "../../utils/firebaseApp";
import {
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import spinner from "../../components/Spinner";
import DocItem from "./DocItem";
import DocEditModal from "./DocEditModal";

function Firestore() {
  const [addingData, setAddingData] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addingPath, setAddingPath] = useState("");
  const [addingError, setAddingError] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [edittingDoc, setEdittingDoc] = useState(null);
  const [editingError, setEdittingError] = useState("");
  const [isEdittingDoc, setIsEdittingDoc] = useState(false);
  const [settedCollectionName, setSettedCollectionName] = useState("");

  const changeAddingDataHandler = (e) => {
    setAddingData(e.target.value);
  };

  const changeAddingPathHandler = (e) => {
    setAddingPath(e.target.value);
  };

  const changeCollectionHandler = (e) => {
    setCollectionName(e.target.value);
  };

  const clickFetchCollectionsHandler = async () => {
    setSettedCollectionName(collectionName);
    return;
    if (!collectionName.trim()) {
      alert("Collection's name cannot be empty");
      return;
    }

    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc);
    });
    setDocuments(docs);
  };

  const addDataHandler = (e) => {
    e.preventDefault();

    try {
      console.log(addingData);
      const object = JSON.parse(addingData);
      console.log(object);
      setAddingError("");
      setIsAdding(true);
      setDoc(doc(db, addingPath, `user-${Date.now()}`), object)
        .then((result) => {
          console.log("added");
          console.log(result);
          setIsAdding(false);
        })
        .catch((err) => {
          console.log(err);
          setIsAdding(false);
        });
    } catch (error) {
      console.log(error);
      setIsAdding(false);
      setAddingError(error.message);
      return;
    }
  };

  const openEditModalHandler = (doc) => {
    setEdittingDoc(doc);
  };

  const onHideEdittingModal = () => {
    setEdittingDoc(null);
    setEdittingError("");
    setIsEdittingDoc(false);
  };

  const updateDocHandler = async (currentDoc, updatedValue) => {
    try {
      const docRef = doc(db, collectionName, currentDoc.id);
      setEdittingError("");
      setIsEdittingDoc(true);
      const result = await updateDoc(docRef, updatedValue);
      console.log("updated");
      onHideEdittingModal();
    } catch (error) {
      setEdittingError(error.message);
      setIsEdittingDoc(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!settedCollectionName.trim()) return;
    console.log("runnn fetch realtime");

    const q = query(collection(db, settedCollectionName));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc);
      });
      setDocuments(docs);
    });

    return () => {
      unsubscribe();
    };
  }, [settedCollectionName]);

  return (
    <div>
      <div>
        <form className="py-4" onSubmit={addDataHandler}>
          <h3>Add data</h3>
          <div>
            <label htmlFor="">
              <p>JSON</p>
              <textarea
                className="w-100 form-control"
                value={addingData}
                onChange={changeAddingDataHandler}
              ></textarea>
            </label>
          </div>

          <div>
            <label>
              <p>Path</p>
              <input
                type="text"
                className="form-control"
                value={addingPath}
                onChange={changeAddingPathHandler}
              />
            </label>
          </div>

          <p className="text-danger">{addingError}</p>
          <button className="btn btn-primary mt-3">
            {isAdding ? spinner : "Add"}
          </button>
        </form>
      </div>

      <div>
        <h3>Fetch data</h3>
        <hr />
        <label>
          <p>Collection</p>
          <input
            type="text"
            className="form-control"
            value={collectionName}
            onChange={changeCollectionHandler}
          />
        </label>

        <button
          onClick={clickFetchCollectionsHandler}
          className="btn btn-primary mt-3"
        >
          Fetch collection
        </button>

        <div>
          {documents.map((doc) => (
            <DocItem
              key={doc.id}
              doc={doc}
              onOpenEditModal={openEditModalHandler}
            />
          ))}
        </div>
      </div>

      {edittingDoc && (
        <DocEditModal
          doc={edittingDoc}
          onUpdateDoc={updateDocHandler}
          error={editingError}
          onHide={onHideEdittingModal}
          isLoading={isEdittingDoc}
        />
      )}
    </div>
  );
}

export default Firestore;
