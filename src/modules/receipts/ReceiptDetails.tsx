import React, { useRef } from "react";
import { ReceiptModel } from "./ReceiptModel";
import { FormatMoney } from "../../global/actions/formatMoney";
import QRCodeGenerator from "../../global/QRCode";
import { FaDownload, FaPrint } from "react-icons/fa";
import { fetchData } from "../../global/api";
import axios from "axios";
import { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../../global/enums/alertTypeEnum";
import { UserModel } from "../users/models/userModel";
import { RxCross1 } from "react-icons/rx";
import { PAYMENT_TYPE_DATA } from "../../global/PreDefinedData/PreDefinedData";
import { setConfirm } from "../../other/ConfirmSlice";
import { setUserAction } from "../../global/actions/actionSlice";
import { useReactToPrint } from "react-to-print";
import { calculateFutureDate } from "./calculateFutureDate";
import { calculateBalanceDate } from "./calculateBalanceDate";

interface Props {
  receipt?: ReceiptModel;
  toggleShowReceiptDetails: () => void;
}

const ReceiptDetails: React.FC<Props> = ({
  receipt,
  toggleShowReceiptDetails,
}) => {
  const initialDate = new Date(String(receipt?.initialDate));
  const initialDate2 = new Date(String(receipt?.initialDate));

  const dispatch = useDispatch<AppDispatch>();

  // Ref for the component to be printed
  const contentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    contentRef,
  });

  // handle download receipt
  const handleDownloadReceipt = async () => {
    const currentUser: UserModel = JSON.parse(
      localStorage.getItem("dnap-user") as string
    );

    if (receipt) {
      try {
        const result = await axios.get(
          `http://localhost:1000/api/download-receipt/${Number(
            receipt.receiptId
          )}/${Number(currentUser.userId)}`,
          { responseType: "arraybuffer" }
        );

        if (result.data.status && result.data.status !== "OK") {
          dispatch(
            setAlert({
              status: true,
              type: AlertTypeEnum.danger,
              message: result.data,
            })
          );

          return;
        }

        if (result.status !== 200) {
          dispatch(
            setAlert({
              status: true,
              type: AlertTypeEnum.danger,
              message: "Error occurred please try again.",
            })
          );

          return;
        }

        // Create a blob from the PDF Stream and download it
        const file = new Blob([result.data], { type: "application/pdf" }); // Create a blob from the PDF Stream
        const fileURL = URL.createObjectURL(file); // Create a URL for the blob to be downloaded by the user later
        const link = document.createElement("a"); // Create an anchor tag to trigger the download
        link.href = fileURL; // Set the href attribute of the anchor tag to the URL of the blob to be downloaded
        link.download = `Receipt-${receipt.receiptNumber}.pdf`; // Set the download attribute of the anchor tag to the name of the file to be downloaded  // Trigger the download by clicking the anchor tag
        link.click(); // Remove the anchor tag from the DOM after the download is triggered   // Revoke the URL of the blob to free up memory
        URL.revokeObjectURL(fileURL); // Dispatch an alert to the user to show that the download was successful
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("DOWNLOADING RECEIPT CANCELLED: ", error.message);
        }
      } finally {
        dispatch(setConfirm({ status: false, message: "" }));
      }
    }
  };

  return (
    <div className="w-full h-svh bg-gray-100 flex justify-center items-center py-10 text-sm">
      <div className="w-full lg:w-1/2 h-[calc(100vh-50px)] m-auto overflow-auto py-20 lg:p-5 lg:px-10 flex flex-wrap justify-center items-center bg-white relative mt-10 lg:mt-0">
        <button
          className="absolute right-5 top-5 text-xl p-2 lg:hover:bg-red-600 lg:hover:text-white"
          onClick={toggleShowReceiptDetails}
        >
          <RxCross1 />
          {/* Close button */}
        </button>

        <div
          className="w-full m-auto py-5 p-10 flex flex-wrap justify-center"
          ref={contentRef} // Attach the ref to the section to print
        >
          <img
            src="/images/logo-colored-no-bg.png"
            alt="Logo"
            height={60}
            width={60}
          />
          <h1 className="text-3xl w-full text-center font-extrabold">
            Receipt
          </h1>
          <h6 className="w-full text-center text-sm py-1">
            {receipt?.receiptNumber}
          </h6>
          <h6 className="w-full text-center text-sm py-1">
            {new Date(String(receipt?.dateCreated)).toDateString()}
          </h6>

          <h6 className="w-full text-center text-lg py-1 text-green-800 font-bold">
            {FormatMoney(Number(receipt?.amount), 2, String(receipt?.currency))}
          </h6>

          <div className="flex justify-between w-full py-5">
            {/* issuer details */}
            <div className="w-1/2 xs:w-full">
              <h3 className="text-lg font-bold">Issuer</h3>
              <h6>
                {receipt?.issuer.firstName + " " + receipt?.issuer.lastName}
              </h6>
              <h6>{receipt?.issuer.userTelephone}</h6>
              <h6>{receipt?.issuer.userEmail}</h6>
              <h6 className="font-bold italic capitalize">
                {receipt?.issuer.userRole}
              </h6>
            </div>

            {/* receiver details */}
            <div className="w-1/2 text-end xs:w-full">
              <h3 className="text-lg font-bold">Receiver</h3>
              <h6>{"USR-" + receipt?.receiver.userId}</h6>
              <h6>
                {receipt?.receiver.firstName + " " + receipt?.receiver.lastName}
              </h6>
              <h6>{receipt?.receiver.userTelephone}</h6>
              <h6>{receipt?.receiver.userEmail}</h6>
              <h6 className="font-bold italic capitalize">
                {receipt?.receiver.userRole}
              </h6>
            </div>
          </div>

          {/* transaction details */}
          <div className="w-full">
            <h6>
              <b>Transaction: </b>
              {receipt?.transaction}
            </h6>
            {receipt?.initialDate && (
              <h6>
                <b>Up to: </b>

                {calculateFutureDate(
                  Number(receipt?.balance),
                  initialDate,
                  String(receipt?.paymentPattern),
                  Number(receipt?.period)
                )}
              </h6>
            )}
            <h6>
              <b>Amount: </b>
              {FormatMoney(
                Number(receipt?.amount),
                2,
                String(receipt?.currency)
              )}
            </h6>
            <h6>
              <b>Payment method: </b>
              {
                PAYMENT_TYPE_DATA.find(
                  (type) => type.value === receipt?.paymentMethod
                )?.label
              }
            </h6>
            <h6>
              <b>Payment date: </b>
              {new Date(String(receipt?.paymentDate)).toDateString()}
            </h6>
            <h6>
              <b>Description: </b>
              {receipt?.description}
            </h6>

            <h4 className="text-lg font-bold text-end pt-5">
              Total:{" "}
              {FormatMoney(
                Number(receipt?.amount),
                2,
                String(receipt?.currency)
              )}
            </h4>

            {receipt?.initialDate && (
              <h4 className="text-sm font-bold text-end pt-2">
                Balance for{" "}
                {calculateBalanceDate(
                  initialDate2,
                  String(receipt?.paymentPattern),
                  Number(receipt?.period)
                )}{" "}
                :{" "}
                {FormatMoney(
                  Number(receipt?.balance),
                  2,
                  String(receipt?.currency)
                )}
              </h4>
            )}
          </div>

          <div className="py-10">
            <QRCodeGenerator
              value={
                "RCT-" +
                receipt?.receiptId +
                ", " +
                receipt?.receiptNumber +
                ", " +
                FormatMoney(
                  Number(receipt?.amount),
                  2,
                  String(receipt?.currency)
                ) +
                ", " +
                new Date(String(receipt?.paymentDate)).toDateString()
              }
              size={100}
              bgColor="#ffffff"
              fgColor="#172554"
              level="H"
            />
          </div>
        </div>

        <div className="w-full flex justify-around items-center pt-5">
          <button
            onClick={() => {
              dispatch(
                setConfirm({
                  status: true,
                  message: "Please confirm download receipt.",
                })
              );

              dispatch(setUserAction({ userAction: handleDownloadReceipt }));
            }} // Use the new handler
            className="w-fit px-2 text-blue-400 lg:hover:text-white lg:hover:bg-blue-400 text-lg flex items-center border-blue-400 border-2 rounded-lg"
          >
            <FaDownload /> <span>Download</span>
          </button>

          <button
            // onClick={onPrintClick} // Use the new handler
            className="w-fit px-2 text-green-600 lg:hover:text-white lg:hover:bg-green-600 text-lg flex items-center border-green-600 border-2 rounded-lg"
            onClick={() => handlePrint()}
          >
            <FaPrint /> <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetails;
