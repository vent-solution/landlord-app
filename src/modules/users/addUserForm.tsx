import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AppDispatch } from "../../app/store";
import { postData, putData } from "../../global/api";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { GenderEnum } from "../../global/enums/genderEnum";
import { UserRoleEnum } from "../../global/enums/userRoleEnum";
import isValidEmail from "../../global/validation/emailValidation";
import markRequiredFormField from "../../global/validation/markRequiredFormField";
import isValidTelephone from "../../global/validation/telephoneValidation";
import { setAlert } from "../../other/alertSlice";

import { UserModel } from "./models/userModel";
import { addUser, getUserById, getUsersStatus, updateUser } from "./usersSlice";
import { RxCross2 } from "react-icons/rx";
import checkRequiredFormFields from "../../global/validation/checkRequiredFormFields";
import validateFormData from "../../global/validation/validateFormData";

// function props
interface Props {
  toggleShowForm: () => void;
}

const AddUserForm: React.FC<Props> = ({ toggleShowForm }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // LOCAL STATE VARIABLES
  const [user, setUser] = useState<UserModel>({
    firstName: "",
    lastName: "",
    otherNames: "",
    gender: "",
    userRole: "",
    userTelephone: "",
    userEmail: "",
    userPassword: "",
    addedBy: { userId: null },
    linkedTo: { userId: null },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [GenderValues] = useState([
    GenderEnum.male,
    GenderEnum.female,
    GenderEnum.others,
  ]);

  const [userRole] = useState<{ label: string; value: string }[]>([
    { label: "Manager", value: UserRoleEnum.manager },
    { label: "Staff", value: UserRoleEnum.staff },
  ]);

  const [isValid] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const selectedUser = useSelector(getUserById(Number(userId)));
  const usersStatus = useSelector(getUsersStatus);

  const firstNameRef = useRef<HTMLInputElement>(null);

  // VALIDATE GENDER VALUES
  const isValidGender =
    user.gender === GenderEnum.male ||
    user.gender === GenderEnum.female ||
    user.gender === GenderEnum.others;

  // VALIDATE USER ROLE VALUES
  const isValidUserRole =
    user.userRole === UserRoleEnum.manager ||
    user.userRole === UserRoleEnum.staff;

  // CHECK IF REQUIRED FIELDS ARE PROVIDED TO AUTHORIZE SAVING NEW USER
  const canSave =
    Boolean(user.firstName) &&
    Boolean(user.lastName) &&
    Boolean(user.gender) &&
    Boolean(user.userRole) &&
    Boolean(user.userTelephone) &&
    Boolean(user.userPassword) &&
    Boolean(user.userEmail);

  // add the linkedTo and addedBy userParameter
  useEffect(() => {
    const timeOut = setTimeout(() => {
      const linkedToUser: UserModel = JSON.parse(
        localStorage.getItem("dnap-user") as string
      );
      let linkedToId: string;
      let addedById: string = String(linkedToUser.userId);

      if (linkedToUser.userRole !== UserRoleEnum.landlord) {
        linkedToId = String(linkedToUser.linkedTo);
      } else {
        linkedToId = String(linkedToUser.userId);
      }

      setUser((prev) => ({
        ...prev,
        linkedTo: { userId: String(linkedToId) },
        addedBy: { userId: String(addedById) },
        userRole: selectedUser?.userRole,
      }));
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [selectedUser?.userRole]);

  // Update form when editing a user
  useEffect(() => {
    const linkedToUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );
    let linkedToId: string;
    let addedById: string = String(linkedToUser.userId);

    if (linkedToUser.userRole !== UserRoleEnum.landlord) {
      linkedToId = String(linkedToUser.linkedTo);
    } else {
      linkedToId = String(linkedToUser.userId);
    }

    if (userId && selectedUser) {
      setUser((previousUser) => ({
        ...previousUser,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        otherNames: selectedUser.otherNames,
        gender: selectedUser.gender,
        userTelephone: selectedUser.userTelephone,
        userEmail: selectedUser.userEmail,
        addedBy: { userId: addedById },
        linkedTo: { userId: linkedToId },
      }));
    } else {
      setUser({
        firstName: "",
        lastName: "",
        otherNames: "",
        gender: "",
        userRole: "",
        userTelephone: "",
        userEmail: "",
        userPassword: "",
        addedBy: { userId: addedById },
        linkedTo: { userId: linkedToId },
      });
    }
  }, [userId, selectedUser]);

  // handle change of form field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

    const parent = e.target.parentElement;
    const label = parent?.querySelector("label");
    const span = label?.querySelector("span");

    if (value.trim().length < 1) {
      markRequiredFormField(e.target);
      label?.classList.remove("text-black");
      label?.classList.add("text-black");
      span?.classList.remove("text-red-600");
      span?.classList.add("text-black");
    } else {
      label?.classList.add("text-black");
      label?.classList.remove("text-black");
      span?.classList.add("text-red-600");
      span?.classList.remove("text-black");
    }
  };

  // CLEAR USER FORM
  const clearUserForm = () => {
    // clear form fields
    setUser({
      firstName: "",
      lastName: "",
      otherNames: "",
      gender: "",
      userRole: "",
      userTelephone: "",
      userEmail: "",
      userPassword: "",
      // addedBy: { userId: null },
      linkedTo: { userId: null },
    });
  };

  // handle save user button
  const onSaveUserClicked = async () => {
    // check for any empty required form field
    if (!canSave) {
      checkRequiredFormFields([
        document.getElementById("userRole") as HTMLInputElement,
        document.getElementById("firstName") as HTMLInputElement,
        document.getElementById("lastName") as HTMLInputElement,
        document.getElementById("gender") as HTMLInputElement,
        document.getElementById("userTelephone") as HTMLInputElement,
        document.getElementById("userEmail") as HTMLInputElement,
        document.getElementById("userPassword") as HTMLInputElement,
      ]);

      dispatch(
        setAlert({
          message: "Please fill in all the required fields marked by (*)",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // validate user role
    if (!isValidUserRole) {
      validateFormData(
        document.getElementById("userRole") as HTMLInputElement,
        isValid
      );
      dispatch(
        setAlert({
          message: "Invalid user role!",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // validate telephone number
    if (!isValidTelephone(String(user.userTelephone))) {
      validateFormData(
        document.getElementById("userTelephone") as HTMLInputElement,
        isValid
      );
      dispatch(
        setAlert({
          message: "Invalid phone number",
          type: AlertTypeEnum.danger,
          status: true,
        })
      );
      return;
    }

    // validate email
    if (!isValidEmail(String(user.userEmail))) {
      validateFormData(
        document.getElementById("userEmail") as HTMLInputElement,
        isValid
      );
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid email.",
          status: true,
        })
      );
      return;
    }

    // validate gender
    if (!isValidGender) {
      validateFormData(
        document.getElementById("gender") as HTMLInputElement,
        isValid
      );
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: "Invalid gender.",
          status: true,
        })
      );
      return;
    }

    // save the user
    try {
      // dispatch(setUsersStatus("loading"));

      const result = await postData("/saveUser", user);

      // check if the user was not saved successfully and set an error alert
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
        return;
      }

      // set a success alert if the user was saved successfully
      dispatch(
        setAlert({
          message: "User saved successfully.",
          type: AlertTypeEnum.success,
          status: true,
        })
      );

      // clear form fields after successfully saving the user
      clearUserForm();

      // add the saved user to the list if user was saved successfully
      dispatch(addUser(result.data));
      firstNameRef.current?.focus();
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED: ", error.message);
      }
      // dispatch(setUsersStatus("error"));
    }
  };

  // updating user
  const onUpdateUserClicked = async () => {
    try {
      const result = await putData(`editUser/${userId}`, user);
      console.log(result.data);
      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            type: AlertTypeEnum.danger,
            status: true,
          })
        );
      } else {
        dispatch(
          setAlert({
            message: "User info has been updated successfully.",
            type: AlertTypeEnum.success,
            status: true,
          })
        );

        if (location.pathname.includes("staff")) {
          navigate("/staffs");
        } else {
          navigate("/users");
        }
        toggleShowForm();
        dispatch(updateUser({ id: userId, changes: result.data }));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("REQUEST CANCELLED ", error.message);
      }
    }
  };

  // hide and show password
  const handleTogglePassword = () => setShowPassword(!showPassword);

  // set the cursor focus to the firstName field on form rendering
  useEffect(() => firstNameRef.current?.focus(), []);

  return (
    <form
      action=""
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
      className="w-full h-[calc(100vh-90px)] overflow-auto bg-gray-100 lg:p-10 mt-16 lg:mt-0"
    >
      <div className="w-full lg:w-1/2 lg:m-auto shadow-2xl p-5">
        <h1 className="text-3xl w-full text-center mb-3 flex items-center justify-between shadow-lg p-5">
          <span>{!userId ? "Add new user" : "Edit user"} </span>
          <span
            className="bg-gray-300 p-1 cursor-pointer lg:hover:bg-red-500 lg:hover:text-white rounded-sm"
            onClick={() => {
              toggleShowForm();
              clearUserForm();
              userId ? navigate(`/users/${userId}`) : navigate(`/users`);
            }}
          >
            <RxCross2 />
          </span>
        </h1>

        {/* USER ROLE  */}
        {!userId && user.userRole !== UserRoleEnum.landlord && (
          <div className="form-group py-2 lg:py-3">
            <label
              htmlFor="userRole"
              className={`w-full text-sm font-bold text-slate-700`}
            >
              User role <span className={"text-red"}>*</span>
            </label>
            <input
              autoFocus
              ref={firstNameRef}
              type="text"
              id="userRole"
              name="userRole"
              list="userRoleList"
              value={user.userRole || ""}
              placeholder="Enter user role"
              onChange={(e) => {
                markRequiredFormField(e.target);
                handleChange(e);
              }}
              className="w-full py-1 px-3 rounded-md outline-none text-gray-900  border focus:border-blue-400"
            />
            <datalist id="userRoleList" className="w-full">
              {userRole.map((role, index) => (
                <option key={index} value={role.value} />
              ))}
            </datalist>
            <small className="w-full text-red-600">User role is required</small>
          </div>
        )}

        {/* FIRST NAME FORM FIELD */}
        <div className="form-group py-2 lg:py-3">
          <label
            htmlFor="firstName"
            className={`w-full text-sm font-bold text-slate-700
          `}
          >
            First Name
            <span className={"text-red"}>*</span>
          </label>
          <input
            type="text"
            id="firstName"
            value={user.firstName || ""}
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChange(e);
            }}
            autoComplete="true"
            placeholder="Enter first nam"
            className="w-full py-1 px-3 rounded-md outline-none text-gray-900  border-b-2 focus:border-blue-400"
          />
          <small className="w-full text-red-600">First name is required.</small>
        </div>

        {/* LAST NAME FORM FIELD */}
        <div className="form-group py-2 lg:py-3">
          <label
            htmlFor="lastName"
            className={`w-full text-sm font-bold text-slate-700`}
          >
            Last Name
            <span className={"text-red"}>*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={user.lastName || ""}
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChange(e);
            }}
            autoComplete="true"
            placeholder="Enter last name"
            className="w-full py-1 px-3 rounded-md outline-none text-gray-900  border-b-2 focus:border-blue-400"
          />
          <small className="w-full text-red-600">Last name is required</small>
        </div>

        {/* OTHER NAMES FIELD */}
        <div className="form-group py-2 lg:py-3">
          <label
            htmlFor="otherNames"
            className={`w-full text-sm font-bold text-slate-700`}
          >
            Other names
            <span className={"text-red"}></span>
          </label>
          <input
            type="text"
            id="otherNames"
            value={user.otherNames || ""}
            onChange={handleChange}
            autoComplete="true"
            placeholder="Enter other names"
            className="w-full py-1 px-3 rounded-md outline-none text-gray-900  border-b-2 focus:border-blue-400"
          />
          <small className="text-red-100 hidden"></small>
        </div>

        {/* GENDER FIELD  */}
        <div className="form-group py-2 lg:py-3">
          <label
            htmlFor="gender"
            className={`w-full text-sm font-bold text-slate-700`}
          >
            Gender
            <span className={"text-red"}>*</span>
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            list="genderList"
            value={user.gender || ""}
            placeholder="Enter gender"
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChange(e);
            }}
            className="w-full py-1 px-3 rounded-md outline-none text-gray-900  border-b-2 focus:border-blue-400"
          />
          <datalist id="genderList" className="w-full">
            {GenderValues.map((gender, index) => (
              <option key={index} value={gender} />
            ))}
          </datalist>
          <small className="w-full text-red-600">Gender is required</small>
        </div>

        {/* TELEPHONE FORM FIELD */}
        <div className="form-group py-2 lg:py-3">
          <label
            htmlFor="userTelephone"
            className={`w-full text-sm font-bold text-slate-700`}
          >
            Telephone
            <span className={"text-red"}>*</span>
          </label>
          <input
            type="tel"
            id="userTelephone"
            value={user.userTelephone || ""}
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChange(e);
            }}
            placeholder="Enter telephone"
            autoComplete="true"
            className="w-full py-1 px-3 rounded-md outline-none text-gray-900  border-b-2 focus:border-blue-400"
          />
          <small className="w-full text-red-600">Telephone is required.</small>
        </div>

        {/* EMAIL FORM FIELD */}
        <div className="form-group py-2 lg:py-3">
          <label
            htmlFor="userEmail"
            className={`w-full text-sm font-bold text-slate-700`}
          >
            Email
            <span className={"text-red"}>*</span>
          </label>
          <input
            type="text"
            id="userEmail"
            value={user.userEmail || ""}
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChange(e);
            }}
            placeholder="Enter email"
            autoComplete="true"
            className="w-full text-sm py-1 px-3 rounded-md outline-none text-gray-900  border-b-2 focus:border-blue-400"
          />
          <small className="w-full text-red-600">Email is required.</small>
        </div>

        {/* PASSWORD FORM FIELD */}
        <div className="form-group py-2 lg:py-5 relative">
          <label
            htmlFor="userPassword"
            className={`w-full text-sm font-bold text-slate-700`}
          >
            Password
            <span className={"text-red"}>*</span>
          </label>
          <input
            type={`${!showPassword ? "password" : "text"}`}
            id="userPassword"
            value={user.userPassword || ""}
            onChange={(e) => {
              markRequiredFormField(e.target);
              handleChange(e);
            }}
            placeholder="Enter Password"
            autoComplete="true"
            className="w-full py-1 px-3 rounded-md outline-none text-gray-900  border-b-2 focus:border-blue-400"
          />
          <small className="w-full text-red-600">Password is required.</small>
          <div
            title={`${showPassword ? "Hide password" : "Show password"}`}
            className="absolute right-0 top-1/3 w-fit text-xl cursor-pointer p-1 hover:text-gray-500 "
            onClick={handleTogglePassword}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        </div>

        {/* FORM ACTION BUTTONS  */}
        <div className="flex justify-around py-10">
          {!userId ? (
            <button
              className={`bg-blue-700 hover:bg-blue-500 cursor-pointer p-5 py-2 w-1/3 text-lg  text-white rounded-lg`}
              onClick={onSaveUserClicked}
            >
              {usersStatus === "loading" ? "Wait..." : "Add"}
            </button>
          ) : (
            <button
              className={`bg-blue-700 hover:bg-blue-500 cursor-pointer p-5 py-2 w-1/3 text-lg text-white rounded-lg`}
              onClick={onUpdateUserClicked}
            >
              {usersStatus === "loading" ? "Wait..." : "Update"}
            </button>
          )}

          {/* CANCEL BUTTON */}
          <button
            className="bg-gray-900 p-5 py-2 w-1/3 text-lg hover:bg-gray-800 lg:hover:hover:bg-gray-500 text-white rounded-lg"
            onClick={() => {
              toggleShowForm();
              clearUserForm();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default React.memo(AddUserForm);
