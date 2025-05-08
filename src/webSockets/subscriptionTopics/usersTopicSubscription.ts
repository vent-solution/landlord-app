import { logOutAction } from "../../global/actions/logOut";
import { UserActivity } from "../../global/enums/userActivity";
import { UserStatusEnum } from "../../global/enums/userStatusEnum";
import { UserModel } from "../../modules/users/models/userModel";
import { updateStatus } from "../../modules/users/usersSlice";
import { webSocketService } from "../socketService";

export const usersTopicSubscription = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: any,
  currentUser: UserModel
) => {
  webSocketService.subscribe("/topic/users", (message) => {
    const content = JSON.parse(JSON.stringify(message.content));

    if (
      Number(content?.userId) === Number(currentUser.userId) &&
      message.activity === UserActivity.blockUser
    ) {
      logOutAction(dispatch, setLoading);
    }

    // update user status on logout socket message
    if (message.activity === UserActivity.logout) {
      dispatch(
        updateStatus({
          userId: Number(message.userId),
          userStatus: UserStatusEnum.offline,
        })
      );
    }

    // update user status on login socket message
    if (message.activity === UserActivity.login) {
      dispatch(
        updateStatus({
          userId: Number(message.userId),
          userStatus: UserStatusEnum.online,
        })
      );
    }
  });
};
