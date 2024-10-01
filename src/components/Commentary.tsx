import React from "react";
import { ICommentary } from "../App";

const Commentary: React.FC<{
  commentaries: Array<ICommentary>,
  toggleEditMode: (ballId: string | false) => () => void,
  isEditMode: string | false
}> = ({ commentaries, toggleEditMode, isEditMode }) => {
  return (
    <div className="mt-4 p-2 border-t border-gray-300">
      <h3 className="font-bold">Ball Commentary</h3>
      <div className="flex flex-col gap-2 px-2 py-2 mt-4 relative">
        {
          commentaries.map(commentary => {
            return <p key={commentary._id} className={`flex gap-4 px-2 ${isEditMode === commentary._id ? 'bg-green-300 py-1 sticky bottom-0' : ''}`}>
              <span>{commentary.over}</span>
              <span>{commentary.commentary}</span>
              <button type="button" onClick={toggleEditMode(commentary._id)} className="hover:font-semibold">Edit</button>
              {
                isEditMode === commentary._id && <button type="button" onClick={toggleEditMode(false)} className="hover:font-medium text-red-500">Cancel</button>
              }
            </p>
          })
        }
      </div>
    </div>
  );
};

export default Commentary;
