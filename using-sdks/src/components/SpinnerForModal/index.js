import spinner from "../Spinner";

const styles = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
};

function SpinnerForModal() {
  return <div style={styles}>{spinner}</div>;
}

export default SpinnerForModal;
