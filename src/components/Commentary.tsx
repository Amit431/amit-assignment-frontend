import React from "react";

const Commentary: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="mt-4 p-2 border-t border-gray-300">
      <h3 className="font-bold">Ball Commentary</h3>
      <div className="flex flex-col gap-2 px-4 py-2 mt-6">
        <p>{text}</p>
        <p>{text}</p>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Commentary;
