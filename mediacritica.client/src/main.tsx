import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App.tsx";
import "./Main.scss";


createRoot(document.getElementById("root")!).render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
);
