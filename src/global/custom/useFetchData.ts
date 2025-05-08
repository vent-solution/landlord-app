import { useEffect, useState } from "react";
import { fetchData } from "../api";
import axios from "axios";

const useFetchData = (endpoint: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await fetchData(endpoint);
        setData(result);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("REQUEST CANCELLED: ", error.message);
        }
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetchData;
