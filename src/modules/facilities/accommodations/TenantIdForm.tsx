import React, { useState } from "react";
import { ACCOMMODATION_TYPE_DATA } from "../../../global/PreDefinedData/PreDefinedData";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setConfirm } from "../../../other/ConfirmSlice";
import { setUserAction } from "../../../global/actions/actionSlice";
import { setAlert } from "../../../other/alertSlice";
import { AlertTypeEnum } from "../../../global/enums/alertTypeEnum";
import axios from "axios";
import { fetchData, postData } from "../../../global/api";
import { UserModel } from "../../users/models/userModel";
import { TenantModel } from "../../tenants/TenantModel";
import { HistoryStatus } from "../../../global/enums/historyStatus";
import { UserActivity } from "../../../global/enums/userActivity";
import { SocketMessageModel } from "../../../webSockets/SocketMessageModel";
import { webSocketService } from "../../../webSockets/socketService";
import { addHistory } from "../history/HistorySlice";

interface Props {
  facilityId: number;
  accommodationId: number;
  unitNumber: string | undefined;
  unitType: string | undefined;
  setIsCheckInExistingTenant: React.Dispatch<React.SetStateAction<boolean>>;

  setTenantChoice: React.Dispatch<
    React.SetStateAction<{
      label: string;
      value: string;
    }>
  >;

  setTenants: React.Dispatch<React.SetStateAction<TenantModel[] | undefined>>;
}

const TenantIdForm: React.FC<Props> = ({
  facilityId,
  accommodationId,
  unitNumber,
  unitType,
  setIsCheckInExistingTenant,
  setTenantChoice,
  setTenants,
}) => {
  // local state variables
  const [tenantData, setTenantData] = useState<{
    facilityId: number;
    accommodationId: number;
    tenantId: number;
    unitNumber: string;
  }>({
    facilityId: facilityId,
    accommodationId: accommodationId,
    tenantId: 0,
    unitNumber: String(unitNumber),
  });

  const dispatch = useDispatch<AppDispatch>();

  // handle change textfield value
  const handleChangeTenantId = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setTenantData((prev) => ({ ...prev, tenantId: Number(value.slice(4)) }));
  };

  // handle check in tenant
  const handleCheckInTenant = async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    try {
      const result = await postData(
        `/add-tenant-to-accommodation/${Number(currentUser.userId)}`,
        tenantData
      );

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            message: result.data.message,
            status: true,
            type: AlertTypeEnum.danger,
          })
        );

        return;
      }

      if (result.status !== 200) {
        dispatch(
          setAlert({
            message: "COULDN'T CHECKIN TENANT",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );

        return;
      }

      setTenants((prev) => (prev ? [...prev, result.data] : [result.data]));

      dispatch(
        setAlert({
          message: "Teanant has been checked in successfully.",
          status: true,
          type: AlertTypeEnum.success,
        })
      );

      setIsCheckInExistingTenant(false);
      setTenantChoice({
        label: "",
        value: "",
      });

      const content = JSON.stringify({
        accommodationId: accommodationId,
        tenantId: tenantData.tenantId,
        status: HistoryStatus.checkIn,
      });

      const socketMessage: SocketMessageModel = {
        userId: Number(currentUser.userId),
        userRole: String(currentUser.userRole),
        content: content,
        activity: UserActivity.checkInTenant,
      };

      webSocketService.sendMessage("/app/check-in-tenant", socketMessage);

      const historyResult = await fetchData(
        `fetch-history-on-check-in/${Number(accommodationId)}/${Number(
          tenantData.tenantId
        )}/${HistoryStatus.checkIn}`
      );

      if (!historyResult) {
        return;
      }

      if (historyResult.data.status && historyResult.data.status !== "OK") {
        return;
      }

      dispatch(addHistory(historyResult.data));
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("CHECK IN TENANT CANCELLED: ", error.message);
      }
    } finally {
      dispatch(
        setConfirm({
          message: "",
          status: false,
        })
      );
    }
  };

  return (
    <form className="w-full lg:w-1/3 p-5" onSubmit={(e) => e.preventDefault()}>
      <h1 className="text-4xl w-full">CheckIn tenant</h1>
      <div className="py-10  text-xl">
        <p className="2">Facility: {tenantData.facilityId}</p>
        <p className="2">Unit: {unitNumber}</p>
        <p className="2">
          Type:{" "}
          {
            ACCOMMODATION_TYPE_DATA.find((type) => type.value === unitType)
              ?.label
          }
        </p>
      </div>
      <div className="form-group w-full text-sm">
        <label htmlFor="tenantId" className="font-bold">
          Tenant Number
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name=""
          id="tenantId"
          placeholder="Enter tenant number (eg. TNT-43)"
          className="w-full shadow-2xl"
          onChange={handleChangeTenantId}
        />
        <small></small>
      </div>

      <div className="form-group w-full py-10 flex justify-center items-center">
        <button
          type="submit"
          className="py-2 px-5 text-lg text-white bg-blue-700 lg:hover:bg-blue-400 active:py-1 active:px-4"
          onClick={() => {
            if (tenantData.tenantId < 1) {
              dispatch(
                setAlert({
                  message:
                    "Please enter tenant number in the format (TNT-957) to continue",
                  status: true,
                  type: AlertTypeEnum.danger,
                })
              );
              return;
            }
            dispatch(
              setConfirm({
                message: `Are you sure you want to checkin tenant (TNT-${
                  tenantData.tenantId
                }) to unit (${
                  ACCOMMODATION_TYPE_DATA.find(
                    (type) => type.value === unitType
                  )?.label
                } ${unitNumber}) of facility (FAC-${facilityId})`,
                status: true,
              })
            );

            dispatch(setUserAction({ userAction: handleCheckInTenant }));
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TenantIdForm;
