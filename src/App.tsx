import React, { useEffect, useRef, useState } from "react";
import FeedingPanel, { IStatsPayload } from "./components/FeedingPanel";
import RightPanel from "./components/ScoreboardPanel";
import Commentary from "./components/Commentary";
import axios from "axios";
import { FiLoader } from "react-icons/fi";

const matchId = '66fa843073fc3499e24b6272'

export interface ICommentary {
  _id: string;
  commentary: string;
  over: string;
  strikerBatsmanName: string;
  bowlerName: string;
}

export interface IScoreBoard {
  teamA: {
    teamName: string;
    runs: number;
    overs: string;
    wickets: number;
    wides: number;
    noballs: number;
    legbyes: number;
    byes: number;
    overthrows: number;
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
  remainingBatsman: Partial<{
    name: string;
    runs: number;
    ballsFaced: number;
  }>[];
  
  bowlers: Partial<{
    name: string;
    runs: number;
    overs: number;
    isBowling: boolean;
  }>[];

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
  const [isReady, setIsReady] = useState<boolean | null>(null)

  const [scoreBoard, setScoreBoard] = useState<IScoreBoard>({
    teamA: {
      teamName: "", runs: 0, overs: "", wickets: 0, wides: 0,
      noballs: 0,
      legbyes: 0,
      byes: 0,
      overthrows: 0,
    },
    teamB: { teamName: "", score: 0, overs: "", wickets: 0 },
    strikerBatsman: { name: "", runs: 0, ballsFaced: 0 },
    nonStrikerBatsman: { name: "", runs: 0, ballsFaced: 0 },
    remainingBatsman: [],
    bowlers: [],
    ballbyball: []
  });

  const fetchScoreBoard = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API_URL}/match/${matchId}/scoreboard`);
      playingPlayerRef.current.striker = response.data.strikerBatsman._id
      playingPlayerRef.current.nonstriker = response.data.nonStrikerBatsman._id
      playingPlayerRef.current.bowler = response.data.bowlers.find((bowler: { isBowling: boolean }) => bowler.isBowling)

      setScoreBoard(response.data as IScoreBoard);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const TestServer = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_API_URL}`)
      setIsReady(true)
    } catch (error) {
      console.log(error);
      setIsReady(false);
    }
  }

  useEffect(() => {
    TestServer()
    fetchScoreBoard()
  }, [])

  async function handleDoneAction(payload: IStatsPayload) {
    try {
      if (isEditMode) {
        await handleEdit(isEditMode, payload)
        fetchScoreBoard()
        return
      }

      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/match/${matchId}/update-stats`, {
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
      await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/match/edit/${matchId}/${ballId}`, { payload })
    } catch (error) {
      console.log(error);
    }
  }

  function toggleEditMode(ballId: string | false) {
    return function () {
      setIsEditMode(ballId)
    }
  }

  if (isReady === null) {
    return <div className="h-screen w-full flex justify-center items-center text-xl gap-4">
      <FiLoader className="animate-spin mt-1" size={32} />
      Setting Up...
    </div>
  }

  if (!isReady) {
    return <div className="h-screen w-full flex justify-center items-center text-red-500 text-lg">
      Connection to Server Failed. Try After Sometime...
    </div>
  }

  return (
    <div className={`flex px-4 relative ${isEditMode ? 'bg-gray-100 min-h-screen' : ''}`}>
      <div className="w-7/12 border-r border-gray-300 sticky top-0 h-screen">
        <FeedingPanel onPayloadChange={handleDoneAction} isEditMode={isEditMode} key={isEditMode as React.Key} />
        {
          isEditMode && <button className="col-span-3 mt-4 p-4 bg-red-500 text-white rounded-lg mr-4" onClick={() => setIsEditMode(false)}>Cancel</button>
        }
        <button onClick={async () => {
          const ans = confirm("You want to continue")
          if (!ans) return
          await axios.delete(`${import.meta.env.VITE_SERVER_API_URL}/match/${matchId}/reset`)
          await fetchScoreBoard()
          setIsEditMode(false)
        }} className="border p-4 py-2 border-gray-500">Reset Match Scoreboard</button>
      </div>
      <div className="w-5/12">
        <RightPanel scoreBoard={scoreBoard} fetchScoreboard={fetchScoreBoard} />
        <Commentary commentaries={scoreBoard.ballbyball} toggleEditMode={toggleEditMode} isEditMode={isEditMode} />
      </div>
    </div>
  );
};

export default App;
