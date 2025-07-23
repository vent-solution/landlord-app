import React, { useState } from "react";

interface Props {
  element: boolean | undefined;
}

const SwitchButton: React.FC<Props> = ({ element }) => {
  const [isActive, setIsActive] = useState(element);

  // update button switch status
  const updateStatus = () => setIsActive(!isActive);

  return (
    <div
      className={`switch-button cursor-pointer shadow-inner ${
        isActive ? "shadow-blue-600" : "shadow-gray-600"
      } bg-gray-200 rounded-full h-5 w-10`}
      onClick={() => {
        updateStatus();
      }}
    >
      <div
        className={`switch transition-all duration-300 delay-150 ease-in-out transform rounded-full h-5 w-5 ${
          isActive ? "bg-blue-600 ml-5" : "bg-gray-500 ml-0"
        } `}
      ></div>
    </div>
  );
};

export default SwitchButton;
