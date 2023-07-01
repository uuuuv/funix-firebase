import styles from "./DocEditModal.module.css";
import { useState } from "react";
import { crossSVG } from "../../assets/icons";
import SpinnerForModal from "../../components/SpinnerForModal";

function DocEditModal({ doc, onUpdateDoc, error, onHide, isLoading }) {
  const [updatedValue, setUpdatedValue] = useState(JSON.stringify(doc.data()));

  const changeHandler = (e) => {
    setUpdatedValue(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let updatedDoc;
    try {
      updatedDoc = JSON.parse(updatedValue);
    } catch (error) {
      alert("Invalid JSON value");
      return;
    }

    onUpdateDoc(doc, updatedDoc);
  };

  const onClickCloseButton = () => {
    onHide();
  };
  return (
    <>
      <div className={styles.DocEditModal}>
        {isLoading && <SpinnerForModal />}
        <button className={styles.closeButton} onClick={onClickCloseButton}>
          {crossSVG}
        </button>
        <form onSubmit={submitHandler}>
          <label>
            <p>JSON</p>

            <textarea
              value={updatedValue}
              onChange={changeHandler}
              className="w-100 form-control"
            ></textarea>
          </label>

          <p className="text-danger">{error}</p>
          <button className="btn btn-primary mt-3">Update</button>
        </form>
      </div>
      <div className="backdrop" />
    </>
  );
}

export default DocEditModal;
