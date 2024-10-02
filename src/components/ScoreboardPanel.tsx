import React from "react";
import { IScoreBoard } from "../App";
import axios from "axios";


const TeamScore = ({ teamName, score, overs, wickets }: { teamName: string, score: number, overs: string, wickets: number }) => {
    return (
        <div className="flex flex-col justify-center items-center">
            <span className="font-bold">{teamName}</span>
            <div className="flex gap-4">
                <span>{score || 0}/{wickets || 0}</span>
                <div>
                    (<span>{overs || '0.0'}</span>)
                </div>
            </div>
        </div>
    );
};

const RightPanel: React.FC<{
    scoreBoard: IScoreBoard,
    fetchScoreboard: () => void
}> = ({ scoreBoard, fetchScoreboard }) => {

    return (
        <div className="p-4 border-l border-gray-300">
            <h2 className="text-lg font-bold">Match Stats</h2>
            <div className="grid grid-cols-2 mt-2 place-items-center">
                <TeamScore
                    teamName={scoreBoard.teamA.teamName}
                    score={scoreBoard.teamA.runs}
                    wickets={scoreBoard.teamA.wickets}
                    overs={scoreBoard.teamA.overs}
                />
                <TeamScore
                    teamName={scoreBoard.teamB.teamName}
                    score={scoreBoard.teamB.score}
                    wickets={scoreBoard.teamB.wickets}
                    overs={scoreBoard.teamB.overs}
                />
            </div>
            <div className="flex gap-2 my-2">
                <span><span className="font-medium">Wd:</span> {scoreBoard.teamA.wides}</span>
                <span><span className="font-medium">NB:</span> {scoreBoard.teamA.noballs}</span>
                <span><span className="font-medium">LB:</span> {scoreBoard.teamA.legbyes}</span>
                <span><span className="font-medium">Byes:</span> {scoreBoard.teamA.byes}</span>
                {/* <span><span className="font-medium">OverThrows:</span> {scoreBoard.teamA.overthrows}</span> */}
            </div>
            <div className="mt-4">
                <h3 className="font-bold">Batsman:</h3>
                <span className="cursor-pointer" onClick={async () => {
                    await axios.put(`${import.meta.env.VITE_SERVER_API_URL}//match/toggle/strike`)
                    fetchScoreboard()
                }}>Change Strike</span>
                <table className="w-full border text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Runs</th>
                            <th>Balls</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{scoreBoard.strikerBatsman.name} *</td>
                            <td>{scoreBoard.strikerBatsman.runs}</td>
                            <td>{scoreBoard.strikerBatsman.ballsFaced}</td>
                        </tr>
                        <tr>
                            <td>{scoreBoard.nonStrikerBatsman.name}</td>
                            <td>{scoreBoard.nonStrikerBatsman.runs}</td>
                            <td>{scoreBoard.nonStrikerBatsman.ballsFaced}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-2">
                <h3 className="font-bold">Bowler:</h3>
                <table className="w-full border text-center">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Runs</th>
                            <th>Overs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{scoreBoard.bowler.name}</td>
                            <td>{scoreBoard.bowler.runs}</td>
                            <td>{scoreBoard.bowler.overs}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RightPanel;
