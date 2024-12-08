import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router";
import { useEffect } from "react";
import { GetUser } from "./Server/Server";
import "./App.scss";
import { useRecoilState } from "recoil";
import { UserModel } from "./Interfaces/UserModel";
import { userState } from "./State/GlobalState";

function App() {
  const [user, setUser] = useRecoilState<UserModel>(userState);

  useEffect(() => {
    async function FetchUser() {
      const userData = await GetUser(user.email);
      setUser(userData);
    }
    FetchUser();
  }, []);

  return (
    <div className="wrapper">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
