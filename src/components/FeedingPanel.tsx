import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa"; // Import tick icon

// Define the types for the payload
export interface IStatsPayload {
    normal: number;
    noball: boolean;
    legbye: boolean;
    byes: boolean;
    overthrow: number; // How many runs come on overthrow if no runs then -1
    wide: boolean;
}

export interface IStatsReqPayload {
    matchId: string;
    batsmanId: string;
    bowlerId: string;
    payload: IStatsPayload;
}

const buttonStyles = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-teal-500",
    "bg-teal-500",
    "bg-teal-500",
    "bg-teal-500",
    "bg-teal-500",
];

const FeedingPanel: React.FC<{ onPayloadChange: (payload: IStatsPayload) => Promise<void>, isEditMode: string | false }> = ({ onPayloadChange, isEditMode }) => {
    const [selected, setSelected] = useState<{
        runs: number | null;
        extras: string[];
    }>({
        runs: null,
        extras: [],
    });

    const [payload, setPayload] = useState<IStatsPayload>({
        normal: 0,
        noball: false,
        legbye: false,
        byes: false,
        overthrow: -1,
        wide: false,
    });

    useEffect(() => {
        if (isEditMode) {
            reset()
        }
    }, [isEditMode])

    const handleButtonClick = (value: number | keyof IStatsPayload) => {
        if (typeof value === "number") {
            // Handle normal runs selection
            setSelected((prev) => {
                // If overthrow is selected, allow normal run selection
                if (payload.overthrow !== -1) {
                    // If the user selects runs after an overthrow, update normal and allow normal runs
                    return { ...prev, extras: prev.extras };
                } else {
                    // If no overthrow selected, proceed with normal selection
                    return { ...prev, runs: value, }; // Reset extras when selecting runs
                }
            });
            if (payload.overthrow !== -1) {
                setPayload((prev) => ({
                    ...prev,
                    overthrow: value
                }));
            }
            else
                setPayload((prev) => ({
                    ...prev,
                    normal: value,
                }));
        } else if (value === "overthrow") {
            if (payload.overthrow > 0) {
                setPayload(prev => ({
                    ...prev, overthrow: -1
                }))
            } else {
                // Allow selecting additional runs after choosing an overthrow
                setPayload((prev) => ({
                    ...prev,
                    overthrow: payload.overthrow === -1 ? payload.normal : payload.overthrow + 1, // Increase overthrow count
                }));
            }
        } else {
            // Handle extra buttons (e.g., No Ball, Leg Bye, etc.)
            setSelected((prev) => {
                const newExtras = prev.extras.includes(value) ? prev.extras.filter((e) => e !== value) : [...prev.extras, value];
                const newPayload = {
                    ...payload,
                    [value]: !payload[value], // Toggle the boolean for the selected extra
                };
                setPayload(newPayload);
                return {
                    ...prev,
                    extras: newExtras,
                };
            });
        }
    };

    function reset() {
        // Reset the selections if needed
        setSelected({ runs: null, extras: [] });
        setPayload({
            normal: 0,
            noball: false,
            legbye: false,
            byes: false,
            overthrow: -1,
            wide: false,
        });
    }

    const handleDone = async () => {
        // Process the selected runs and extras into the final payload
        const finalPayload: IStatsPayload = {
            normal: selected.runs ?? 0, // If no runs are selected, default to 0
            noball: payload.noball,
            legbye: payload.legbye,
            byes: payload.byes,
            overthrow: payload.overthrow, // Manage overthrow separately if needed
            wide: payload.wide,
        };

        // Call the onPayloadChange with the final payload
        await onPayloadChange(finalPayload);

        reset()
    };

    return (
        <div className="p-8 grid grid-cols-3 gap-4">
            <h2 className="col-span-3 text-lg font-bold mb-4">Feeding Panel</h2>
            {/* Normal Run Buttons */}
            {[0, 1, 2, 3, 4, 5, 6].map((run) => (
                <button
                    key={run}
                    onClick={() => handleButtonClick(run)}
                    className={`p-4 text-white font-semibold rounded-lg ${selected.runs === run ? "opacity-100" : "opacity-70"} ${buttonStyles[run]}`}
                >
                    {run} {
                        run === 4 ? '(FOUR)' : run === 6 ? '(SIX)' : null
                    } {(selected.runs === run || payload.overthrow === run) && <FaCheck className="inline ml-2" />}
                </button>
            ))}
            {/* Extra Runs Buttons */}
            {["noball", "legbye", "byes", "wide"].map((type, index) => {
                const isTick = (payload[type as keyof IStatsPayload] && payload[type as keyof IStatsPayload] !== -1);

                return (
                    <button
                        key={type}
                        onClick={() => handleButtonClick(type as keyof Omit<IStatsPayload, "normal" | "overthrow">)} // Type assertion
                        className={`p-4 text-white font-semibold rounded-lg ${isTick ? "opacity-100" : "opacity-70"} ${buttonStyles[7 + index % buttonStyles.length]}`}
                    >
                        {type.replace(/([A-Z])/g, " $1").toLowerCase()} {isTick && <FaCheck className="inline ml-2" />}
                    </button>
                );
            })}
            {/* Overthrow Button */}
            <button
                onClick={() => handleButtonClick("overthrow")}
                className={`p-4 text-white font-semibold rounded-lg ${payload.overthrow !== -1 ? "shadow-lg" : "opacity-70"} bg-gray-500`}
            >
                Overthrow {payload.overthrow !== -1 && <FaCheck className="inline ml-2" />}
            </button>

            {/* Display selected runs and extras as badges */}
            <div className="mt-4 col-span-3">
                <h3 className="font-semibold">Selected:</h3>
                <div className="flex flex-wrap items-center gap-2">
                    {selected.runs !== null && (
                        <span className="bg-gray-200 text-gray-800 px-4 py-1 rounded-md">{selected.runs}</span>
                    )}
                    {
                        selected.runs !== null && selected.runs > 0 && (selected.extras.length > 0 || payload.overthrow !== -1) && '+'
                    }
                    {selected.extras.map((extra) => (
                        <span key={extra} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md">
                            {extra}
                        </span>
                    ))}
                    {payload.overthrow !== -1 && (
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md">
                            Overthrow: {payload.overthrow}
                        </span>
                    )}
                </div>
            </div>

            {/* Done Button */}
            <button onClick={handleDone} className="col-span-3 mt-4 p-4 bg-blue-600 text-white rounded-lg">
                Done
            </button>
        </div>
    );
};

export default FeedingPanel;
