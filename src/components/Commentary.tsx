import React from "react";

const Commentary: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="mt-4 p-2 border-t border-gray-300">
      <h3 className="font-bold">Ball Commentary</h3>
      <p>{text}</p>
    </div>
  );
};

export default Commentary;
