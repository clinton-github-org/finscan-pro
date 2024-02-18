import axios from 'axios';
import uploadFile from '../../services/uploadFile';

jest.mock('axios');

afterEach(() => {
    jest.clearAllMocks();
});

const response = { data: 'File uploaded' };

describe('should upload file successfully', () => {
    beforeEach(() => {
        (axios.post as jest.Mock).mockResolvedValueOnce(response);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should have right response', async () => {
        await uploadFile();

        // expect(response.data).toBe(response.data);
        expect(axios.post).toHaveBeenCalledWith('URL', {}, {
            headers: {
                'Accept': 'application/json',
            }
        });
    });

    // eslint-disable-next-line jest/no-commented-out-tests
    // it('should handle network error', async () => {
    //     (axios.post as jest.Mock).mockReturnValueOnce(Promise.reject('Network Error'));

    //     expect.assertions(1);

    //     let axiosError;

    //     try {
    //         await uploadFile();
    //     } catch (error) {
    //         axiosError = error as AxiosError;
    //     } finally {
    //         expect(axiosError).toEqual('Network Error');
    //     }
    // });
});

