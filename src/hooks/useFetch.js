// Your useFetch.js
import { useEffect, useState } from "react";
import { apiGet } from "../services/apiService";

export default function useFetch(url) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGet(url);
                setIsLoading(false);
                setData(response.data);
            } catch (err) {
                setError(err);
                console.error("error fetching data: ", err.response);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url]);

    return { data, error, isLoading };
}