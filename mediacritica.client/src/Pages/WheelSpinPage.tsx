import { Button } from "@mui/material";
import "./WheelSpinPage.scss";
import { Roulette, RouletteItem, useRoulette } from "react-hook-roulette";
import TopBar from "../Components/TopBar";
import { useState } from "react";

function WheelSpinPage() {
  const media = [
    { name: "Media 1" },
    { name: "Media 2" },
    { name: "Media 3" },
    { name: "Media 4" },
    { name: "Media 5" },
    { name: "Media 6" },
    { name: "Media 7" },
    { name: "Media 8" },
    { name: "Media 9" },
  ] as RouletteItem[];

  const options = {
    size: 600,
    showArrow: media.length > 1,
    style: {
      canvas: {
        bg: "#141414",
      },
      arrow: {
        bg: "whitesmoke",
        size: 20,
      },
      label: {
        font: "16px Orbitron",
        defaultColor: "whitesmoke",
      },
      pie: {
        border: true,
        borderColor: "whitesmoke",
        borderWidth: 2,
        theme: [
          { bg: "#971212" },
          { bg: "#E27300" },
          { bg: "#FCC400" },
          { bg: "#808900" },
          { bg: "#225353" },
          { bg: "#16A5A5" },
          { bg: "#0062B1" },
          { bg: "#653294" },
          { bg: "#FA28FF" },
        ],
      },
    },
  };

  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const { roulette, onStart, onStop, result } = useRoulette({
    items: media,
    onSpinUp: () => {
      setIsWheelSpinning(true);
      setTimeout(onStop, 1500);
    },
    onSpinEnd: () => setIsWheelSpinning(false),
    options: options,
  });

  return (
    <div className="wheelspinpage-container">
      <div className="wheelspinpage">
        <TopBar />
        <div className="header">
          <h1>Wheelspin</h1>
        </div>
        <div className="wheelspin">
          <div className="wheel">
            <Roulette roulette={roulette} />
            <div className="actions">
              <Button
                disabled={isWheelSpinning || media.length < 2}
                onClick={onStart}
              >
                SPIN THE WHEEL!
              </Button>
            </div>
          </div>
          <div className="selection-container">
            <div className="search">Search</div>
            <div className="selection">Selection</div>
            <div className="result">
              Result: {result ? result : "Not Determined"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WheelSpinPage;
