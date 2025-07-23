import { Routes, Route } from "react-router-dom";
import UsersPage from "./modules/users/usersPage";
import Layout from "./components/Layout";
import OfficesPage from "./modules/offices/OfficesPage";
import SubscriptionsPage from "./modules/subscription/SubscriptionsPage";
import BidsPage from "./modules/bids/bidsPage";
import SingleOfficePage from "./modules/offices/SingleOfficePage";
import LogsPage from "./modules/logs/LogsPage";
import Dashboard from "./modules/dashboard/Dashboard";
import FacilitiesPage from "./modules/facilities/FacilitiesPage";
import SingleFacilityPage from "./modules/facilities/SingleFacilityPage";
import SingleUserPage from "./modules/users/SingleUserPage";
import TenantsPage from "./modules/tenants/TenantsPage";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./app/store";
import { UserModel } from "./modules/users/models/userModel";
import MarketPlacePage from "./modules/market/MarketPlacePage";
import ReceiptsPage from "./modules/receipts/ReceiptsPage";
import { UserRoleEnum } from "./global/enums/userRoleEnum";
import { fetchFacilities } from "./modules/facilities/FacilitiesSlice";
import { webSocketService } from "./webSockets/socketService";
import { usersTopicSubscription } from "./webSockets/subscriptionTopics/usersTopicSubscription";
import { facilitiesTopicSubscription } from "./webSockets/subscriptionTopics/facilitiesTopicSubscription";
import { accommodationsTopicSubscription } from "./webSockets/subscriptionTopics/accommodationsTopicSubscription";
import { getUserLocation } from "./global/api";
import LandingPage from "./modules/LandingPage";
import { fetchUsers } from "./modules/users/usersSlice";

const currentUser: UserModel = JSON.parse(
  localStorage.getItem("dnap-user") as string
);
function App() {
  const [, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // fetch all the landlord users

  // socket connection and subscription
  useEffect(() => {
    webSocketService.connect();

    usersTopicSubscription(setLoading, dispatch, currentUser);
    facilitiesTopicSubscription(dispatch);
    accommodationsTopicSubscription(dispatch);

    return () => {
      console.log("Unsubscribing from WebSocket...");
      webSocketService.unsubscribe("/topic/users");
      webSocketService.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    getUserLocation();
  }, []);

  // fetch facilities that belong to the current landlord
  useEffect(() => {
    let userId: number;
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    if (currentUser?.userRole !== UserRoleEnum.landlord) {
      userId = Number(currentUser?.linkedTo);
    } else {
      userId = Number(currentUser.userId);
    }

    dispatch(
      fetchFacilities({
        userId: Number(userId),
        page: 0,
        size: 50,
      })
    );

    // fetch all the landlord users
    dispatch(fetchUsers({ userId: Number(userId), page: 0, size: 10 }));
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={`/:userId`}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route path={`/dashboard`}>
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="users">
          <Route index element={<UsersPage />} />
          <Route path=":userId" element={<SingleUserPage />} />
        </Route>

        <Route path="tenants">
          <Route index element={<TenantsPage />} />
        </Route>

        <Route path="offices">
          <Route index element={<OfficesPage />} />
          <Route path=":officeId" element={<SingleOfficePage />} />
        </Route>

        <Route path="subscription">
          <Route index element={<SubscriptionsPage />} />
        </Route>

        <Route path="bids">
          <Route index element={<BidsPage />} />
        </Route>

        <Route path="logs">
          <Route index element={<LogsPage />} />
        </Route>

        <Route path="receipts">
          <Route index element={<ReceiptsPage />} />
        </Route>

        <Route path="facilities">
          <Route index element={<FacilitiesPage />} />
          <Route path=":facilityId" element={<SingleFacilityPage />} />
        </Route>

        <Route path="market">
          <Route index element={<MarketPlacePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
