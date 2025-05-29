import React from "react";
import { CgDanger } from "react-icons/cg";

interface Props {
  itemName: string;
}
const EmptyList: React.FC<Props> = ({ itemName }) => {
  return (
    <div className="w-ull h-full flex flex-wrap justify-center items-center">
      <h1 className="w-full text-center text-xl flex justify-center uppercase">
        <CgDanger className="text-red-600 mx-2 text-3xl" />
        <span>{`no ${itemName} found`}</span>
      </h1>
      <div
        className="w-14 lg:w-20 h-14 lg:h-20"
        style={{
          background: "URL('/landlord/images/Ghost.gif')",
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
};

export default EmptyList;
