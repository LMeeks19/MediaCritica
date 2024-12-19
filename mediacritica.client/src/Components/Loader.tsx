import { BeatLoader } from "react-spinners";

function Loader() {
  return (
    <div className="loader">
      <BeatLoader
        speedMultiplier={0.5}
        color="rgba(151, 18, 18, 1)"
        size={20}
      />
    </div>
  );
}
export default Loader;
