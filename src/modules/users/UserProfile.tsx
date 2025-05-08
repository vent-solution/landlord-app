import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getUserById } from "./usersSlice";
import AddUserForm from "./addUserForm";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";

interface Props {
  userId: number;
}

const UserProfileDetails: React.FC<Props> = ({ userId }) => {
  const [isShowForm, setIsShowForm] = useState<boolean>(false);

  const user = useSelector(getUserById(userId));

  // toggle show user form
  const toggleShowUserForm = useCallback(() => {
    setIsShowForm(!isShowForm);
  }, [isShowForm]);

  // render  user form if the show form is true
  if (isShowForm) return <AddUserForm toggleShowForm={toggleShowUserForm} />;

  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-auto bg-gray-100">
      <div className="p-5 mt-10 w-full lg:w-3/4 bg-white m-auto  shadow-2xl text-sm">
        {/* USER PROFILE */}
        <div className="profile">
          <h1>
            <b>Number: </b> <span>USR-{user?.userId}</span>
          </h1>
          <h1>
            <b>Name: </b> <span>{user?.firstName + " " + user?.lastName}</span>
          </h1>
          <h1>
            <b>Role: </b> <span>{user?.userRole}</span>
          </h1>
          <h1>
            <b>Tel: </b> <span>{user?.userTelephone}</span>
          </h1>
          <h1>
            <b>Email: </b> <span>{user?.userEmail}</span>
          </h1>
        </div>

        <div className="w-full p-3 py-5">
          <button
            className="py-1 px-5 bg-blue-700 lg:hover:bg-blue-500 text-white"
            onClick={toggleShowUserForm}
          >
            Update
          </button>
          {user?.userRole !== UserRoleEnum.landlord && (
            <button
              className="ml-3 py-1 px-5 bg-red-700 lg:hover:bg-red-500 text-white"
              // onClick={toggleShowUserForm}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
