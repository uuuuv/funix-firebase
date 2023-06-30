function AddressItem({ pathItems, onClick, disabled }) {
  const clickHandler = () => {
    if (disabled) return;
    onClick(pathItems.join("/"));
  };

  let className = "addressItem";
  if (disabled) className += " disabled";

  return (
    <span className={className} onClick={clickHandler}>
      /{pathItems.at(-1)}
    </span>
  );
}

export default AddressItem;
