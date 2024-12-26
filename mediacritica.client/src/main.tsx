import "./Main.scss";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
);
