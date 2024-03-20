import axios, { AxiosError, AxiosResponse } from "axios";

interface responseProps {
    s3URL: string;
    id: string;
}

const uploadFile = async (fileName: string, contentType: string): Promise<responseProps> => {
    try {
        const response = await axios({
            url: `${window.location.href}/api/request`,
            data: {fileName, contentType},
            method: 'post'
        });
        if (verifyResponse(response)) {
            return { s3URL: response.data.s3URL, id: response.data.folderName };
        } else {
            throw new Error("Failed to fetch S3 Presigned URL");
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError.response ? axiosError.response.data : axiosError.message;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyResponse = (response: AxiosResponse<any, any>) => {
    return response !== undefined && response.status === 200 && response.data && response.data.s3URL && response.data.folderName;
}

export default uploadFile;