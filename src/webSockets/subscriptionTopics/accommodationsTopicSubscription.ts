import { UserActivity } from "../../global/enums/userActivity";
import { addAccommodation } from "../../modules/facilities/accommodations/accommodationsSlice";
import { UserModel } from "../../modules/users/models/userModel";
import { webSocketService } from "../socketService";

export const accommodationsTopicSubscription = (dispatch: any) => {
  const currentUser: UserModel = JSON.parse(
    localStorage.getItem("dnap-user") as string
  );

  webSocketService.subscribe("/topic/accommodations", (message) => {
    const content = JSON.parse(JSON.stringify(message.content));

    if (
      Number(currentUser.userId) !== Number(message.userId) &&
      message.activity === UserActivity.addAccommodation
    ) {
      dispatch(addAccommodation(content));
    }
  });
};
