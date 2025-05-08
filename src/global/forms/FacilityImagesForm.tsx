import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { postData } from "../api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setAlert } from "../../other/alertSlice";
import { AlertTypeEnum } from "../enums/alertTypeEnum";
import { useNavigate } from "react-router-dom";

// import red from "../../../../../FILES/IMAGES/facility-images"

interface Props {
  setIsShowImageForm: React.Dispatch<React.SetStateAction<boolean>>;
  facility: {
    facilityId: number;
  };
}

const ImagesForm: React.FC<Props> = ({ setIsShowImageForm, facility }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const canSave = images.length > 0;

  // Handle image selection
  const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // Handle remove image from the list
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const previews = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(previews);

    // Cleanup URLs when the component unmounts or the image list updates
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [images]);

  // handle save images
  const handleSaveImages = async () => {
    // check if there is any image selected
    if (!canSave) {
      dispatch(
        setAlert({
          message: "Please select at least one image to save!",
          status: true,
          type: AlertTypeEnum.danger,
        })
      );
      return;
    }

    const formData = new FormData();
    for (let i = 0; i <= images.length; i++) {
      formData.append("files", images[i]);
    }

    try {
      const result = await postData(
        `/save-facility-images/${Number(facility.facilityId)}`,
        formData
      );

      if (result.data.status && result.data.status !== "OK") {
        dispatch(
          setAlert({
            status: true,
            message: result.data.message,
            type: AlertTypeEnum.danger,
          })
        );

        return;
      }

      dispatch(
        setAlert({
          status: true,
          message: result.data.message,
          type: AlertTypeEnum.success,
        })
      );

      navigate("/facilities");
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("IMAGE UPLOADS CANCELLED: ", error.message);
      }
    }
  };

  return (
    <form
      onSubmit={(e: React.FocusEvent<HTMLFormElement>) => e.preventDefault()}
      className="w-full lg:w-3/4 m-auto shadow-lg p-2 lg:p-10 overflow-auto h-4/5"
    >
      <div className="py-5 w-full text-2xl font-bold flex justify-end items-center ">
        <h1 className="font-bold text-xl w-full p-5 text-blue-800">
          Add images
        </h1>
        <RxCross1
          className="lg:hover:bg-red-500 lg:hover:text-white cursor-pointer"
          onClick={() => setIsShowImageForm(false)}
        />
      </div>
      <input
        type="file"
        accept="image/*"
        name="facilityImages"
        id="facilityImages"
        multiple
        onChange={handleChangeImages}
      />

      <div className="p-5 w-full h-fit flex flex-wrap bg-white">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-96 h-96 lg:w-52 lg:h-52  p-5 group"
          >
            <img
              src={imagePreviews[index]}
              alt={image.name}
              className="w-full h-full object-cover hover:border-4 hover:border-blue-600 p-3"
            />

            <button
              className="absolute top-2 right-2 p-2 bg-red-200 cursor-pointer rounded-full 
                         text-white hover:bg-red-500 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => handleRemoveImage(index)}
            >
              <RxCross2 size={24} />
            </button>
          </div>
        ))}
      </div>

      <div className="w-full p-5 flex justify-center items-center">
        <button
          className="py-1 px-5 text-lg bg-blue-700 lg:hover:bg-blue-400 text-white cursor-pointer"
          onClick={handleSaveImages}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ImagesForm;
