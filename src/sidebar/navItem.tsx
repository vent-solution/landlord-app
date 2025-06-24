import React from "react";
import { Link } from "react-router-dom";
import { NavLinkModel } from "../modules/users/models/navLinkModel";
import { IoChevronForward } from "react-icons/io5";

interface Props {
  navLink: NavLinkModel;
  icon: JSX.Element;
  setShowLinks: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavItem: React.FC<Props> = ({ navLink, icon, setShowLinks }) => {
  return (
    <>
      {navLink.link && (
        <Link
          to={String(navLink.link)}
          className={`navLink w-full mt-1 p-2 flex flex-wrap items-center h-fit hover:bg-blue-900 hover:text-white rounded-md ${
            navLink.active ? "bg-blue-900 text-white" : ""
          }`}
          onClick={() => setShowLinks(false)}
        >
          <span className="text-xl pr-4 flex justify-between">{icon}</span>

          <span className="flex justify-between items-center w-5/6 tracking-widest text-sm">
            {navLink.name} <IoChevronForward />
          </span>
        </Link>
      )}
      {navLink.childLinks?.map((child, index) => (
        <Link
          key={index}
          to={String(child.link)}
          className={`navLink  w-full mt-1 p-1 pl-3 font-bold flex items-center h-fit hover:bg-blue-900 hover:text-white ${
            child.active ? "bg-blue-900 text-white " : ""
          }`}
          onClick={() => setShowLinks(false)}
        >
          <span className="px-3">{child.icon}</span>
          <span className="tracking-widest">{child.name}</span>
        </Link>
      ))}
    </>
  );
};

export default NavItem;
