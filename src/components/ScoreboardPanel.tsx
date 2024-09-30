import React from "react";

const RightPanel: React.FC<{ score: number; overs: string; batsman: string; bowler: string }> = ({ score, overs, batsman, bowler }) => {
    return (
        <div className="p-4 border-l border-gray-300">
            <h2 className="text-lg font-bold">Match Stats</h2>
            <div className="mt-2">
                <p>Score: {score}</p>
                <p>Overs: {overs}</p>
            </div>
            <div className="mt-4">
                <h3 className="font-bold">Batsman:</h3>
                <p>{batsman}</p>
            </div>
            <div className="mt-2">
                <h3 className="font-bold">Bowler:</h3>
                <p>{bowler}</p>
            </div>
        </div>
    );
};

export default RightPanel;
