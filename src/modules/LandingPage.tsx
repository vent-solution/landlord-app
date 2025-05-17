import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Preloader from "../other/Preloader";
import { LandlordCreationModel } from "./auth/landlordModel";
import { fetchData } from "../global/api";
import { UserRoleEnum } from "../global/enums/userRoleEnum";
import LandlordForm from "./auth/LandlordForm";

interface Props {}

const LandingPage: React.FC<Props> = () => {
  const { userId } = useParams();

  const [landlord, setLandlord] = useState<LandlordCreationModel>({
    user: {
      userId: 0,
    },

    companyName: "",

    idType: "",
    nationalId: "",

    addressType: "",
    address: {
      country: "",
      state: "",
      city: "",
      county: "",
      division: "",
      parish: "",
      zone: "",
      street: "",
      plotNumber: "",
    },
  });

  const [isShowLandlordForm, setIsShowLandlordForm] = useState(false);

  const navigate = useNavigate();

  // fetch current logged in user
  useEffect(() => {
    setLandlord((prev: any) => ({
      ...prev,
      user: { userId: Number(userId) },
    }));

    const fetchCurrentUser = async (userId: number) => {
      try {
        const result = await fetchData(`/fetch-current-user/${userId}`);

        if (!result) {
          window.location.href = "/";
          return;
        }

        localStorage.setItem(
          "dnap-user",
          JSON.stringify({
            firstName: String(result.data.firstName),
            lastName: String(result.data.lastName),
            userId: Number(result.data.userId),
            userRole: String(result.data.userRole),
            linkedTo: Number(result.data.linkedTo),
          })
        );

        if (result.data.userRole === UserRoleEnum.landlord) {
          const landlord = await fetchData(
            `/fetch-landlord-by-user-id/${Number(result.data.userId)}`
          );

          if (!landlord) {
            return;
          }

          if (landlord.status && landlord.status !== 200) {
            setIsShowLandlordForm(true);
            return;
          } else {
            navigate(`/dashboard`);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(error.message);
        }
      }
    };

    fetchCurrentUser(Number(userId));
  }, [userId]);

  if (isShowLandlordForm)
    return <LandlordForm landlord={landlord} setLandlord={setLandlord} />;

  return (
    <div className="main flex relative w-full">
      <Preloader />
    </div>
  );
};

export default LandingPage;
