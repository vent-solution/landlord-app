import React, { useState } from "react";
import {
  ACCOMMODATION_CATEGORY,
  ACCOMMODATION_TYPE_DATA,
  PAYMENT_PARTERN,
} from "../../../global/PreDefinedData/PreDefinedData";
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
import { addFacilityTenant } from "../tenants/TenantsSlice";
import { AccommodationModel } from "./AccommodationModel";
import { FormatMoney } from "../../../global/actions/formatMoney";
import { businessTypeEnum } from "../../../global/enums/businessTypeEnum";
import checkRequiredFormFields from "../../../global/validation/checkRequiredFormFields";
import { RxCross2 } from "react-icons/rx";
import TenantForm from "../../tenants/TenantForm";
import markRequiredFormField from "../../../global/validation/markRequiredFormField";

interface Props {
  accommodation?: AccommodationModel;
  setIsCheckInTenant: React.Dispatch<React.SetStateAction<boolean>>;

  setTenants: React.Dispatch<React.SetStateAction<TenantModel[] | undefined>>;
}

const TenantIdForm: React.FC<Props> = ({
  accommodation,
  setIsCheckInTenant,
  setTenants,
}) => {
  // local state variables
  const [tenantData, setTenantData] = useState<{
    facilityId: number;
    accommodationId: number;
    tenantId: number;
    unitNumber: string;
    expectedCheckIn: string | null;
  }>({
    facilityId: Number(accommodation?.facility.facilityId),
    accommodationId: Number(accommodation?.accommodationId),
    tenantId: 0,
    unitNumber: String(accommodation?.accommodationNumber),
    expectedCheckIn: null,
  });

  const [isCheckInNewTenant, setIsCheckInNewTenant] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // handle change textfield value
  const handleChangeFormField = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    id === "tenantId"
      ? setTenantData((prev) => ({ ...prev, tenantId: Number(value.slice(4)) }))
      : setTenantData((prev) => ({
          ...prev,
          [id]: value,
        }));
  };

  // handle check in tenant
  const handleCheckInTenant = async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    if (accommodation?.facility.businessType === businessTypeEnum.hospitality) {
      if (!tenantData.tenantId || !tenantData.expectedCheckIn) {
        checkRequiredFormFields([
          document.getElementById("tenantId") as HTMLInputElement,
          document.getElementById("expectedCheckOut") as HTMLInputElement,
        ]);

        dispatch(
          setAlert({
            message: "Please fill all the required form fields!",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );

        dispatch(setConfirm({ status: false, message: "" }));
        return;
      }
    } else {
      if (!tenantData.tenantId) {
        checkRequiredFormFields([
          document.getElementById("tenantId") as HTMLInputElement,
        ]);

        dispatch(
          setAlert({
            message: "Please fill all the required form fields!",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );

        dispatch(setConfirm({ status: false, message: "" }));
        return;
      }
    }

    try {
      const result = await postData(
        `/add-tenant-to-accommodation/${Number(currentUser.userId)}`,
        tenantData
      );

      if (
        result.data.status &&
        result.data.status !== "OK" &&
        result.data.status !== "checkIn"
      ) {
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
            message: "COULDN'T CHECK IN TENANT",
            status: true,
            type: AlertTypeEnum.danger,
          })
        );

        return;
      }

      setTenants((prev) =>
        prev ? [...prev, result.data.tenant] : [result.data.tenant]
      );

      dispatch(addFacilityTenant(result.data));

      dispatch(
        setAlert({
          message: "Tenant has been checked in successfully.",
          status: true,
          type: AlertTypeEnum.success,
        })
      );

      setIsCheckInTenant(false);

      const content = JSON.stringify({
        accommodationId: accommodation?.accommodationId,
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
        `fetch-history-on-check-in/${Number(
          accommodation?.accommodationId
        )}/${Number(tenantData.tenantId)}/${HistoryStatus.checkIn}`
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

  //  conditional rendering is check in new tenant is true
  if (isCheckInNewTenant) {
    return (
      <div className="w-full text-black bg-gray-100 p-5">
        <div className="w-full h-full flex justify-center items-center">
          <TenantForm
            setTenantData={setTenantData}
            setIsCheckInNewTenant={setIsCheckInNewTenant}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-10 h-[calc(100vh-130px)] overflow-auto">
      <form
        className="w-full lg:w-1/2 p-5 lg:p-10 border shadow-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="text-2xl lg:text-3xl w-full font-bold flex justify-between">
          Check in tenant
          <span
            className="bg-pay-200 p-1 lg:hover:bg-red-500 lg:hover:text-white cursor-pointer "
            onClick={() => {
              setIsCheckInTenant(false);
            }}
          >
            <RxCross2 />
          </span>
        </h1>
        <div className="py-10  text-lg">
          <p className="2">{`Unit: ${accommodation?.accommodationNumber} ${
            ACCOMMODATION_TYPE_DATA.find(
              (type) => type.value === accommodation?.accommodationType
            )?.label
          } ${
            accommodation?.accommodationCategory
              ? `(
          ${
            ACCOMMODATION_CATEGORY.find(
              (category) =>
                String(category.value) ===
                String(accommodation?.accommodationCategory)
            )?.label
          })`
              : ""
          } | ${FormatMoney(
            Number(accommodation?.price),
            2,
            String(accommodation?.facility.preferedCurrency)
          )} ${
            PAYMENT_PARTERN.find(
              (pattern) =>
                String(pattern.value) === String(accommodation?.paymentPartten)
            )?.label
          }`}</p>
        </div>
        <div className="w-full flex justify-between items-center py-10 px-5">
          <button
            className="text-white p-2 bg-blue-600 rounded-lg  lg:hover:bg-blue-400 lg:active:scale-95"
            onClick={() => {
              setIsCheckInNewTenant(true);
            }}
          >
            Add new tenant
          </button>
          {tenantData.tenantId && tenantData.tenantId > 0 && (
            <p className="text-xl font-bold uppercase">{`tnt-${tenantData.tenantId}`}</p>
          )}
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
            className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
            onChange={(e) => {
              handleChangeFormField(e);
              markRequiredFormField(e.target);
            }}
          />
          <small className="text-red-500">Tenant number is required!</small>
        </div>

        {accommodation?.facility.businessType ===
          businessTypeEnum.hospitality && (
          <div className="form-group w-full text-sm py-5">
            <label htmlFor="expectedCheckOut" className="font-bold">
              Expected check out {tenantData.expectedCheckIn}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name=""
              id="expectedCheckOut"
              placeholder="Enter expected check in"
              className="w-full outline-none border-2 border-gray-300 rounded-lg focus:border-blue-200"
              onChange={(e) => {
                handleChangeFormField(e);
                markRequiredFormField(e.target);
              }}
            />
            <small className="text-red-500">
              Expected check in is required!
            </small>
          </div>
        )}

        <div className="form-group w-full py-10 flex justify-center items-center">
          <button
            type="submit"
            className="py-2 px-5 text-lg text-white bg-blue-700 lg:hover:bg-blue-400 active:py-1 active:px-4"
            onClick={() => {
              dispatch(
                setConfirm({
                  message: `Are you sure you want to checkin tenant (TNT-${
                    tenantData.tenantId
                  }) to unit (${
                    ACCOMMODATION_TYPE_DATA.find(
                      (type) =>
                        String(type.value) ===
                        String(accommodation?.accommodationType)
                    )?.label
                  } ${accommodation?.accommodationNumber}) of facility (FAC-${
                    accommodation?.facility.facilityId
                  })`,
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
    </div>
  );
};

export default TenantIdForm;
