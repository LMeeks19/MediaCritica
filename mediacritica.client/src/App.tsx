import { useEffect } from "react";
import "./App.css";
import * as dotenv from "dotenv";

dotenv.config();

const MEDIA_API_KEY = process.env.MEDIA_API_KEY;

function App() {

  useEffect (() => {
    async function FetchMovieData() {
      var media = await fetch(`https://www.omdbapi.com/?i=tt11126994&season=2&episode=1&apikey=${MEDIA_API_KEY}`).then((response) => response.json());
      console.log(media);
    }
    FetchMovieData();
  }, [])

  return <h1>Media Critica</h1>;
}

export default App;
