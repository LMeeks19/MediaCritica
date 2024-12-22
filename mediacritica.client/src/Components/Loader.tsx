import { BeatLoader } from "react-spinners";

function Loader() {
  return (
    <div className="loader">
      <BeatLoader
        speedMultiplier={0.5}
        color="var(--palette-color)"
        size={20}
      />
    </div>
  );
}
export default Loader;
