import axios, { AxiosError } from "axios";

const uploadFile = async () => {
    let result;
    try {
        result = await axios.post('', {}, {
            headers: {
                'Accept': 'application/json',
                'Authorization': ''
            }
        });
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.response ? axiosError.response.data : axiosError.message;
    }
    return result;
}

export default uploadFile;