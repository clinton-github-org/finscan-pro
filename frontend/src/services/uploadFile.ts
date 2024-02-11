import axios, { AxiosError, AxiosResponse } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadFile = async (): Promise<AxiosResponse<any, any>> => {
    try {
        const response = await axios.post('URL', {}, {
            headers: {
                'Accept': 'application/json',
            }
        });
        return response;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.response ? axiosError.response.data : axiosError.message;
    }
}

export default uploadFile;