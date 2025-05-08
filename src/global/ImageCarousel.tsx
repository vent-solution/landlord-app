import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { setConfirm } from "../other/ConfirmSlice";
import { setUserAction } from "./actions/actionSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

// import url from "../../../../FILES/IMAGES/facility-images/";

interface Props {
  setIsShowImageForm: React.Dispatch<React.SetStateAction<boolean>>;
  facility: { facilityId: number };
  images: { imageId: number; imageName: string }[];
  imageUrl: string;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  handleDeleteImage: () => Promise<void>;
}

const ImageCarousel: React.FC<Props> = ({
  setIsShowImageForm,
  images,
  imageUrl,
  currentIndex,
  setCurrentIndex,
  handleDeleteImage,
}) => {
  const [showActionButtons, setShowActionButtons] = useState(false);

  // const [images, setImages] = useState<string[]>([
  //   "/images/login-bg-2.jpg",
  //   "https://via.placeholder.com/800x400.png?text=Slide+2",
  //   "/images/login-bg-2.jpg",
  //   "https://via.placeholder.com/800x400.png?text=Slide+3",
  //   "/images/login-bg-2.jpg",
  //   "https://via.placeholder.com/800x400.png?text=Slide+4",
  //   "/images/login-bg-2.jpg",
  //   "https://via.placeholder.com/800x400.png?text=Slide+5",
  //   "/images/login-bg-2.jpg",
  //   "https://via.placeholder.com/800x400.png?text=Slide+6",
  // ]);

  const dispatch = useDispatch<AppDispatch>();

  // scroll to the previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // scroll to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      className="relative w-full h-full max-w-4xl mx-auto"
      onMouseEnter={() => setShowActionButtons(true)}
      onMouseLeave={() => setShowActionButtons(false)}
    >
      {/* Carousel Images */}
      <div className="overflow-hidden relative h-full">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={`${imageUrl}/${image.imageName}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-full flex-shrink-0 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Prev/Next Buttons */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
      >
        Prev
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
      >
        Next
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-gray-800" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>

      {/* Action Buttons (Show on Hover) */}
      <div
        className={`p-4 bg-red-50 absolute top-0 right-0 text-3xl transform -translate-x-1/2 flex space-x-4 transition-opacity duration-300 ${
          showActionButtons ? "opacity-100" : "lg:opacity-0"
        }`}
      >
        {/* button for deleting an image */}
        {images.length > 0 && (
          <button
            className="text-red-600 shadow-black shadow-sm p-2 lg:hover:bg-gray-50"
            onClick={() => {
              dispatch(setUserAction({ userAction: handleDeleteImage }));
              dispatch(
                setConfirm({
                  message: "Are you sure you want to delete this message?",
                  status: true,
                })
              );
            }}
          >
            <MdDelete />
          </button>
        )}

        {/*button for adding a new image */}
        <button
          className="lg:hover:text-white shadow-black shadow-sm p-2 lg:hover:bg-gray-800 text-black"
          onClick={() => setIsShowImageForm(true)}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
