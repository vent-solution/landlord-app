import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import {
  DirectionsService,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";

interface Props {
  toggleOpenAndCloseMap: () => void;
  coords: {
    lat: number;
    lng: number;
  };
  distance: number;
}

const libraries: any = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const google_maps_api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Maps: React.FC<Props> = ({ toggleOpenAndCloseMap, coords }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: `${google_maps_api_key}`,
    libraries,
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  // get current user location
  const [userLocation, setUserLocation] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // get user location every 5 seconds
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // set the directions
  // useEffect(() => {
  //   if (isLoaded) {
  //     const directionService = new google.maps.DirectionsService();

  //     directionService.route(
  //       {
  //         origin: userLocation, // You can change this to dynamic coords if needed
  //         destination: coords, // Use coords prop as the destination
  //         travelMode: google.maps.TravelMode.DRIVING,
  //       },
  //       (result, status) => {
  //         if (status === google.maps.DirectionsStatus.OK) {
  //           setDirections(result);
  //         } else {
  //           console.error(`Error fetching directions: ${status}`);
  //         }
  //       }
  //     );
  //   }
  // }, [isLoaded, coords, userLocation]); // Make sure the effect runs only when the map is loaded

  return (
    <div className="w-full my-5 h-[calc(100vh-200px)] shadow-xl relative flex items-center justify-center ">
      <button
        className="text-xl font-bold lg:hover:text-white lg:hover:bg-red-500 p-2 absolute top-1 right-1 z-20"
        onClick={toggleOpenAndCloseMap}
      >
        <RxCross1 />
      </button>

      {loadError && <h1>Error loading maps!</h1>}

      {!isLoaded && !loadError && <h1>Loading maps...</h1>}

      {isLoaded && !loadError && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coords}
          zoom={10}
        >
          <Marker position={coords} />
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
    </div>
  );
};

export default Maps;
