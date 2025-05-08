import React from "react";

interface Props {
  numberOfUsers: number;
}
const NumberOfUsers: React.FC<Props> = ({ numberOfUsers }) => {
  return (
    <h1 className="font text-2xl text-black w-1/5 bg-red">{numberOfUsers}</h1>
  );
};

export default NumberOfUsers;
