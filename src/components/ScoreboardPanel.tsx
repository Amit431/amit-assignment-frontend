import React, { useState, useEffect, MutableRefObject } from "react";
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

const matchId = '66fa843073fc3499e24b6272'

const RightPanel: React.FC<{
    playingPlayerRef: MutableRefObject<{
        striker: null | string;
        bowler: null | string;
    }>
}> = ({ playingPlayerRef }) => {
    const [scoreBoard, setScoreBoard] = useState({
        teamA: { teamName: "", runs: 0, overs: "", wickets: 0 },
        teamB: { teamName: "", score: 0, overs: "", wickets: 0 },
        strikerBatsman: { name: "", runs: 0, ballsFaced: 0 },
        nonStrikerBatsman: { name: "", runs: 0, ballsFaced: 0 },
        bowler: { name: "", runs: 0, overs: 0 },
    });

    useEffect(() => {
        // Fetching the data from an API
        const fetchScoreBoard = async () => {
            try {
                const response = await axios.get(`http://localhost:6790/api/v1/match/${matchId}/scoreboard`);
                playingPlayerRef.current.striker = response.data.strikerBatsman._id
                playingPlayerRef.current.bowler = response.data.bowler._id
                setScoreBoard(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchScoreBoard();
    }, [playingPlayerRef]);

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
            <div className="mt-4">
                <h3 className="font-bold">Batsman:</h3>
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
