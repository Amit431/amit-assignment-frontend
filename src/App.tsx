import React from "react";
import FeedingPanel, { IStatsPayload } from "./components/FeedingPanel";
import RightPanel from "./components/ScoreboardPanel";
import Commentary from "./components/Commentary";

const App: React.FC = () => {

  const commentary = "Great shot! Four runs!"; // Example commentary

  async function handleDoneAction(payload: IStatsPayload) {
    console.log('====================================');
    console.log(payload);
    console.log('====================================');
  }

  return (
    <div className="flex p-4">
      <div className="w-7/12 border-r border-gray-300">
        <FeedingPanel onPayloadChange={handleDoneAction} />
      </div>
      <div className="w-5/12">
        <RightPanel />
        <Commentary text={commentary} />
      </div>
    </div>
  );
};

export default App;
