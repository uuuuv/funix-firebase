import { useEffect, useState } from "react";
import {
  folderSVG,
  fileSVG,
  clipboardSVG,
  penSVG,
  trashSVG,
} from "../../assets/icons";
import styles from "./Ref.module.css";
import { JUST_UPLOADED, IS_DELETING } from "../../messages";

const emptyFunction = () => {};

function ProcessingText({ text }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        let newDots = prev + ".";
        if (newDots.length === 5) return ".";
        return newDots;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <span>
      {text}
      {dots}
    </span>
  );
}

function RefItem({
  item,
  onClickDelete = emptyFunction,
  onClickRename = emptyFunction,
  onDoubleClick = emptyFunction,
  ...rest
}) {
  const [copied, setCopied] = useState(false);

  const type = item.metadata ? "file" : "folder";
  const icon = type == "folder" ? folderSVG : fileSVG;
  const itemName = item._location.path.split("/").at(-1);

  const clickRenameHandler = () => {
    onClickRename(item);
  };

  const clickDeleteHandler = () => {
    onClickDelete(item);
  };

  const doubleClickHandler = () => {
    if (type === "file") return;
    onDoubleClick(item);
  };

  const copyUrlToClipboard = () => {
    if (item.url) {
      navigator.clipboard.writeText(item.url);
      setCopied(true);
    }
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 5000);
    }
  }, [copied]);

  let refClasses = styles.ref;
  if (item.status === JUST_UPLOADED) refClasses += " " + styles.justUploaded;
  return (
    <div className={refClasses} {...rest} onDoubleClick={doubleClickHandler}>
      {item.status === IS_DELETING && (
        <div className={styles.deletingOverlay}>
          {<ProcessingText text="Deleting" />}
        </div>
      )}
      <div className={styles.icon}>{icon}</div>

      <div className={styles.info + " row"}>
        <div className="col-5">
          <span className={styles.name}>{itemName}</span>
        </div>
        <div className="col-1">
          {item.metadata &&
            Math.round(item.metadata.size / 10.24) / 100 + " KB"}
        </div>
        <div className="col-3">
          {item.metadata && new Date(item.metadata.timeCreated).toDateString()}
        </div>
        <div className="col-3">
          {item.metadata && new Date(item.metadata.updated).toDateString()}
        </div>
      </div>

      {item.metadata && (
        <div
          className={styles.button + " " + styles.copyButton}
          onClick={copyUrlToClipboard}
        >
          {clipboardSVG}
          {copied && <span className={styles.copiedNotifier}>Copied</span>}
        </div>
      )}

      {item.metadata && (
        <div className={styles.button} onClick={clickRenameHandler}>
          {penSVG}
        </div>
      )}

      {item.metadata && (
        <div
          className={styles.button + " text-danger"}
          onClick={clickDeleteHandler}
        >
          {trashSVG}
        </div>
      )}
    </div>
  );
}

export default RefItem;
