/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const PlayerStats: React.FC<{ batsmanStats: any; bowlerStats: any }> = ({ batsmanStats, bowlerStats }) => {
    return (
        <div className="mt-4 p-2 border-t border-gray-300">
            <h3 className="font-bold">Player Stats</h3>
            <div className="mt-2">
                <h4 className="font-semibold">Batsman Stats</h4>
                <p>Runs: {batsmanStats.runs}</p>
                <p>Balls Faced: {batsmanStats.ballsFaced}</p>
            </div>
            <div className="mt-2">
                <h4 className="font-semibold">Bowler Stats</h4>
                <p>Wickets: {bowlerStats.wickets}</p>
                <p>Overs Bowled: {bowlerStats.oversBowled}</p>
            </div>
        </div>
    );
};

export default PlayerStats;
