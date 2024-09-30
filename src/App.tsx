import React, { useRef } from "react";
import FeedingPanel, { IStatsPayload } from "./components/FeedingPanel";
import RightPanel from "./components/ScoreboardPanel";
import Commentary from "./components/Commentary";
import axios from "axios";

const matchId = '66fa843073fc3499e24b6272'


const App: React.FC = () => {

  const commentary = "Great shot! Four runs!";
  const playingPlayerRef = useRef<{
    striker: null | string,
    bowler: null | string
  }>({
    striker: null,
    bowler: null
  })

  async function handleDoneAction(payload: IStatsPayload) {
    try {
      await axios.post(`http://localhost:6790/api/v1/match/${matchId}/update-stats`, {
        payload,
        matchId,
        batsmanId: playingPlayerRef.current.striker,
        bowlerId: playingPlayerRef.current.bowler
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex p-4">
      <div className="w-7/12 border-r border-gray-300">
        <FeedingPanel onPayloadChange={handleDoneAction} />
      </div>
      <div className="w-5/12">
        <RightPanel playingPlayerRef={playingPlayerRef} />
        <Commentary text={commentary} />
      </div>
    </div>
  );
};

export default App;
