import { useLocation } from "react-router-dom";

function EpisodePage() {
    const location = useLocation();

    const episodeId = location.state.episodeId;

    return <div>Episode Page {episodeId}</div>
}

export default EpisodePage;