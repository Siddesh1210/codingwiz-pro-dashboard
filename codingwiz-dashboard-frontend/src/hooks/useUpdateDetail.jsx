import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export async function useUpdateDetail(endpoint, data) {
    try {
        const response = await axios.put(`${BACKEND_URL}${endpoint}`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw (error?.response?.data?.message || error?.message || "Something went wrong");
    }
}
