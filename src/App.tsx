import React, { useEffect, useRef, useState } from "react";
import FeedingPanel, { IStatsPayload } from "./components/FeedingPanel";
import RightPanel from "./components/ScoreboardPanel";
import Commentary from "./components/Commentary";
import axios from "axios";

const matchId = '66fa843073fc3499e24b6272'

export interface ICommentary {
  _id: string;
  commentary: string;
  over: string;
}

export interface IScoreBoard {
  teamA: {
    teamName: string;
    runs: number;
    overs: string;
    wickets: number;
  };
  teamB: {
    teamName: string;
    score: number;
    overs: string;
    wickets: number;
  };
  strikerBatsman: {
    name: string;
    runs: number;
    ballsFaced: number;
  };
  nonStrikerBatsman: {
    name: string;
    runs: number;
    ballsFaced: number;
  };

  bowler: {
    name: string;
    runs: number;
    overs: number;
  };

  ballbyball: Array<ICommentary>;

}


const App: React.FC = () => {
  const playingPlayerRef = useRef<{
    striker: null | string,
    nonstriker: null | string,
    bowler: null | string
  }>({
    striker: null,
    nonstriker: null,
    bowler: null
  })

  const [isEditMode, setIsEditMode] = useState<string | false>(false)

  const [scoreBoard, setScoreBoard] = useState<IScoreBoard>({
    teamA: { teamName: "", runs: 0, overs: "", wickets: 0 },
    teamB: { teamName: "", score: 0, overs: "", wickets: 0 },
    strikerBatsman: { name: "", runs: 0, ballsFaced: 0 },
    nonStrikerBatsman: { name: "", runs: 0, ballsFaced: 0 },
    bowler: { name: "", runs: 0, overs: 0 },
    ballbyball: []
  });

  const fetchScoreBoard = async () => {
    try {
      const response = await axios.get(`http://localhost:6790/api/v1/match/${matchId}/scoreboard`);
      playingPlayerRef.current.striker = response.data.strikerBatsman._id
      playingPlayerRef.current.nonstriker = response.data.nonStrikerBatsman._id
      playingPlayerRef.current.bowler = response.data.bowler._id

      setScoreBoard(response.data as IScoreBoard);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchScoreBoard()
  }, [])

  async function handleDoneAction(payload: IStatsPayload) {
    try {
      if (isEditMode) {
        await handleEdit(isEditMode, payload)
        return
      }

      await axios.post(`http://localhost:6790/api/v1/match/${matchId}/update-stats`, {
        payload,
        matchId,
        strikerId: playingPlayerRef.current.striker,
        nonStrikerId: playingPlayerRef.current.nonstriker,
        bowlerId: playingPlayerRef.current.bowler,
      });
      fetchScoreBoard()
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEdit(ballId: string, payload: IStatsPayload) {
    try {
      await axios.post(`http://localhost:6790/api/v1/match/edit/${matchId}/${ballId}`, {payload})
    } catch (error) {
      console.log(error);
    }
  }

  function toggleEditMode(ballId: string) {
    return function () {
      setIsEditMode(ballId)
    }
  }

  return (
    <div className="flex p-4">
      <div className="w-7/12 border-r border-gray-300">
        <FeedingPanel onPayloadChange={handleDoneAction} isEditMode={isEditMode} key={isEditMode as React.Key} />
        {
          isEditMode && <button className="col-span-3 mt-4 p-4 bg-red-500 text-white rounded-lg" onClick={() => setIsEditMode(false)}>Cancel</button>
        }
      </div>
      <div className="w-5/12">
        <RightPanel scoreBoard={scoreBoard} />
        <Commentary commentaries={scoreBoard.ballbyball} toggleEditMode={toggleEditMode} />
      </div>
    </div>
  );
};

export default App;
