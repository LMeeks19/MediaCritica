import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./Main.scss";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
);
