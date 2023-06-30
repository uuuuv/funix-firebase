import { useEffect, useState } from "react";
import { crossSVG } from "../../assets/icons";
import styles from "./Home.module.css";
import spinner from "../../components/Spinner";

function RenamingModal({ item, onRename, onQuit, isRenaming }) {
  const [newName, setNewName] = useState("");

  const changeHandler = (e) => {
    setNewName(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onRename(item, newName);
  };

  useEffect(() => {
    setNewName(item._location.path.split("/").at(-1));
  }, []);
  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.renamingModal}>
        {isRenaming && <div className={styles.overlaySpinner}>{spinner}</div>}
        <button onClick={onQuit} className={styles.closeBtn}>
          {crossSVG}
        </button>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label>
              <p>Rename</p>
              <input
                type="text"
                className="form-control"
                value={newName}
                onChange={changeHandler}
              />
            </label>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RenamingModal;
