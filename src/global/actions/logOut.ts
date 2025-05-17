import axios from "axios";
import { CurrentUserModel } from "../../modules/users/models/currentUserModel";
import { setAlert } from "../../other/alertSlice";
import { SocketMessageModel } from "../../webSockets/SocketMessageModel";
import { webSocketService } from "../../webSockets/socketService";
import { postData } from "../api";
import { AlertTypeEnum } from "../enums/alertTypeEnum";
import { UserActivity } from "../enums/userActivity";
import { AppDispatch } from "../../app/store";

export const logOutAction = async (
  dispatch: AppDispatch,
  setLoading: (value: React.SetStateAction<boolean>) => void
) => {
  const current_user: CurrentUserModel = JSON.parse(
    localStorage.getItem("dnap-user") as string
  );
  try {
    const result = await postData(`/log-out/${current_user.userId}`, {});
    if (result.data.status && result.data.status !== "OK") {
      dispatch(
        setAlert({
          type: AlertTypeEnum.danger,
          message: result.data.message,
          status: true,
        })
      );
    }

    const socketMessage: SocketMessageModel = {
      userId: Number(current_user.userId),
      userRole: current_user.userRole,
      content: null,
      activity: UserActivity.logout,
    };

    webSocketService.sendMessage("/app/logout", socketMessage);

    // client.send("/app/logout", {}, JSON.stringify(socketMessage));
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("REQUEST CANCELLED: ", error.message);
    }
  } finally {
    setLoading(false);
    window.location.href = "/";
    localStorage.removeItem("dnap-user");
  }
};
