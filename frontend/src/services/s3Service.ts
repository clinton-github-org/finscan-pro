import axios, { AxiosError, AxiosResponse } from "axios";

interface uploadFileToS3Props {
    s3URL: string;
    file: File
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadFileToS3 = async ({ s3URL, file }: uploadFileToS3Props): Promise<AxiosResponse<any, any>> => {
    try {
        const response = await axios({
            url: s3URL,
            data: file,
            method: 'put'
        });
        return response;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.response ? axiosError.response.data : axiosError.message;
    }
}
export default uploadFileToS3;