import React, { useState } from "react";

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <div className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id="toggle"
        className="sr-only"
        checked={isOn}
        onChange={handleToggle}
      />
      <label
        htmlFor="toggle"
        className={`flex items-center p-1 bg-gray-300 rounded-full cursor-pointer
          ${isOn ? "bg-green-500" : "bg-gray-300"}`}
        onClick={handleToggle}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform
            ${isOn ? "translate-x-5" : "translate-x-0"}`}
        ></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
