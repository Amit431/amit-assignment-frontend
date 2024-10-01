import React from "react";
import { ICommentary } from "../App";

const Commentary: React.FC<{
  commentaries: Array<ICommentary>,
  toggleEditMode: (ballId: string) => () => void
}> = ({ commentaries, toggleEditMode }) => {
  return (
    <div className="mt-4 p-2 border-t border-gray-300">
      <h3 className="font-bold">Ball Commentary</h3>
      <div className="flex flex-col gap-2 px-4 py-2 mt-6">
        {
          commentaries.map(commentary => {
            return <p key={commentary._id} className="flex gap-4">
              <span>{commentary.over}</span>
              <span>{commentary.commentary}</span>
              <button type="button" onClick={toggleEditMode(commentary._id)}>Edit</button>
            </p>
          })
        }
      </div>
    </div>
  );
};

export default Commentary;
