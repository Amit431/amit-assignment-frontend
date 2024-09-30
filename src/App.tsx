import React, { useState } from "react";
import FeedingPanel from "./components/FeedingPanel";
import RightPanel from "./components/ScoreboardPanel";
import PlayerStats from "./components/PlayerStats";
import Commentary from "./components/Commentary";

const App: React.FC = () => {
  const [payload, setPayload] = useState({
    normal: 0,
    noBall: false,
    legBye: false,
    bye: false,
    wide: false,
  });

  const score = 100; // Example score
  const overs = "10.2"; // Example overs
  const batsman = "Player A"; // Example batsman name
  const bowler = "Player B"; // Example bowler name
  const batsmanStats = { runs: 50, ballsFaced: 30 }; // Example stats
  const bowlerStats = { wickets: 2, oversBowled: 5 }; // Example stats
  const commentary = "Great shot! Four runs!"; // Example commentary

  return (
    <div className="flex p-4">
      <div className="w-7/12 border-r border-gray-300">
        <FeedingPanel onPayloadChange={setPayload} />
      </div>
      <div className="w-5/12">
        <RightPanel score={score} overs={overs} batsman={batsman} bowler={bowler} />
        <PlayerStats batsmanStats={batsmanStats} bowlerStats={bowlerStats} />
        <Commentary text={commentary} />
      </div>
    </div>
  );
};

export default App;
