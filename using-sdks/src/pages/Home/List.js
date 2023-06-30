import ListItem from "../../components/Ref";

function List({ list, onGetInsideFolder, onClickDelete, onClickRename }) {
  return (
    <>
      {list.map((item) => (
        <div className="py-2 border-bottom" key={item._location.path}>
          <ListItem
            item={item}
            onClickDelete={onClickDelete}
            onClickRename={onClickRename}
            onDoubleClick={onGetInsideFolder}
          />
        </div>
      ))}
    </>
  );
}

export default List;
