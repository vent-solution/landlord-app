import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => error.response
);

// export const getIp = async () => {
//   try {
//     const response = await axios.get("https://api.ipify.org?format=json");
//     console.log("USER IP", response.data);
//     return response.data; // Return the public IP directly
//   } catch (error) {
//     console.error("Error fetching IP address:", error);
//     return null; // Return null or handle error appropriately
//   }
// };

// Get current user location
export const getUserLocation = async () => {
  try {
    const response = await axios.get("http://ip-api.com/json/");
    sessionStorage.setItem("userLocation", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.log("Error fetching user location: ", error);
  }
};

// Get current user location with detailed address
// export const getAddress = async () => {
//   try {
//     const apiKey = "AIzaSyAADf7n_P7fW6iORAB2vCzyGoDDtEzdv0c"; // Replace with your API key
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${0.3077712},${32.5463723}&key=${apiKey}`;

//     // Make the API request
//     const response = await axios.get(url);

//     console.log("Response:", response.data);

//     if (response.data.status === "OK") {
//       const formattedAddress = response.data.results[0].formatted_address;
//       console.log("Address:", formattedAddress);
//     } else {
//       console.log("Unable to fetch address");
//     }
//   } catch (error) {
//     console.log("Error fetching location details", error);
//   }
// };

// Fetch data api request
export const fetchData = async (endpoint: string) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response;
  } catch (error) {
    throw error;
  }
};

// post data api request
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response;
  } catch (error: any) {
    throw error.message;
  }
};

// update data api request
export const putData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosInstance.put(endpoint, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// delete data api request
export const deleteData = async (endpoint: string) => {
  try {
    const response = await axiosInstance.delete(endpoint);
    return response;
  } catch (error) {
    throw error;
  }
};
