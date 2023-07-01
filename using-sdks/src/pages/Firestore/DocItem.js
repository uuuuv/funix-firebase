import styles from "./DocItem.module.css";
import { penSVG } from "../../assets/icons";

function DocItem({ doc, onOpenEditModal }) {
  const onClickHandler = () => {
    onOpenEditModal(doc);
  };
  return (
    <div className={styles.DocItem}>
      <span>{doc.id}</span>
      <div className={styles.editButton} onClick={onClickHandler}>
        {penSVG}
      </div>
    </div>
  );
}

export default DocItem;
