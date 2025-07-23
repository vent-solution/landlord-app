import React, { useEffect, useState } from "react";
import SideBar from "../../sidebar/sideBar";
import { UserModel } from "./models/userModel";
import UserProfileDetails from "./UserProfile";
import UserActivityList from "./UserActivityList";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "./usersSlice";
import { IoMdArrowRoundBack } from "react-icons/io";
import UserRights from "./rights/UserRights";
import { AppDispatch } from "../../app/store";
import { fetchViewRights } from "./rights/viewRightsSlice";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";

interface Props {}
const UsersPage: React.FC<Props> = () => {
  // LOCAL STATES
  const [currentSection, setCurrentSection] = useState<string>("Profile");

  const navigate = useNavigate();
  const { userId } = useParams();

  const user = useSelector(getUserById(Number(userId)));

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    // window.alert([
    //   currentUser.userRole === UserRoleEnum.landlord,
    //   currentUser.userId !== userId,
    //   Number(currentUser.userId) !== Number(userId),
    //   currentUser.userId,
    //   userId,
    // ]);

    if (Number(currentUser.userId) !== Number(userId)) {
      dispatch(fetchViewRights({ userId: Number(userId) }));
    }
  }, [userId, dispatch]);

  // render section depending on the current active link
  const renderSection = (user?: UserModel) => {
    switch (currentSection) {
      case "Profile":
        return <UserProfileDetails userId={Number(user?.userId)} />;
      case "Rights":
        return <UserRights userId={Number(user?.userId)} />;
      case "Activity":
        return <UserActivityList userId={Number(user?.userId)} />;
      default:
        return <UserProfileDetails userId={Number(user?.userId)} />;
    }
  };

  // function for selecting facility section
  const selectSection = (li: HTMLLIElement) => {
    const { id } = li;
    const ul = li.parentElement;

    if (ul) {
      const lis = ul.querySelectorAll("li");
      lis.forEach((l) => {
        l !== li ? l.classList.remove("active") : l.classList.add("active");
      });
    }

    setCurrentSection(id);
  };

  // render preloader screen if not authenticated or page still loading
  // if (status === "loading") {
  //   return <Preloader />;
  // }

  return (
    <div className="main max-h-screen lg:overflow-hidden flex relative w-full">
      <div className="left lg:w-1/5 w-full md:w-full left-0 right-0 fixed lg:relative text-white z-50">
        <SideBar />
      </div>
      <div className="right lg:w-4/5 w-full z-0 mt-20 lg:mt-0">
        <div className="w-full flex py-0 flex-wrap justify-center items-start bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 px-2">
          <div className="w-full lg:w-full py-2 lg:pb-0 flex justify-between lg:px-10 ">
            <button
              className="bg-blue-950 hover:bg-blue-800 text-sm text-white lg:flex items-center p-1 px-3 hidden "
              onClick={() => navigate(-1)}
            >
              <IoMdArrowRoundBack />
              Back
            </button>

            {user?.firstName && (
              <h2 className="text-xl font-bold">
                {"USR-" +
                  user.userId +
                  ", " +
                  user?.firstName +
                  " " +
                  user.lastName}
              </h2>
            )}
          </div>
          <ul className="w-full flex flex-wrap justify-end items-center text-xs lg:text-sm text-blue-900 uppercase p-0 pt-2">
            <li
              id="Profile"
              className="active p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              Profile details
            </li>

            <li
              id="Rights"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              User rights
            </li>

            <li
              id="Activity"
              className="p-2 lg:px-5 lg:py-3 mt-2 font-bold border-b-2 hover:border-b-2 hover:border-red-600 cursor-pointer"
              onClick={(e: React.MouseEvent<HTMLLIElement>) =>
                selectSection(e.currentTarget)
              }
            >
              User activity
            </li>
          </ul>
        </div>
        {renderSection(user)}
      </div>
    </div>
  );
};

export default UsersPage;
