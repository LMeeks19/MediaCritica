import { useEffect } from "react";
import { ConfigModel } from "./Interfaces/ConfigModel";
import "./App.css";

function App() {

  useEffect (() => {
    async function FetchMovieData() {
      var config = await fetch('/Config/GetConfig').then((response) => response.json()) as ConfigModel;
      var media = await fetch(`https://www.omdbapi.com/?i=tt11126994&season=2&episode=1&apikey=${config.MEDIA_API_KEY}`).then((response) => response.json());
      console.log(media);
    }
    FetchMovieData();
  }, [])

  return <h1>Media Critica</h1>;
}

export default App;
