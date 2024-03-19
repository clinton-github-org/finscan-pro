import { Dispatch, SetStateAction, useState } from 'react';
import uploadFileToS3 from '../services/s3Service';
import uploadFile from '../services/uploadFile';

interface HomePage {
  setPage: Dispatch<SetStateAction<string>>;
  setId: Dispatch<SetStateAction<string>>;
}

const HomePage = ({ setPage, setId }: HomePage) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [file, setFile] = useState<File>();

  // File Upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (file !== undefined) {
      setIsError(false);
      try {
        const {s3URL, id} = await uploadFile(file.name);
        setId(id);
        const response = await uploadFileToS3({ s3URL, file });
        if (response.status === 200) {
          setPage('results');
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFileInput = (e: any): void => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      {!isLoading && (
        <>
          <h4>Upload your bank statement for analysis!</h4>
          <form method="post" data-testid="uploadForm">
            <label htmlFor="fileUpload" id="fileUploadLabel">
              <span>Drop files here</span>
              or
              <input
                type="file"
                name="fileUpload"
                id="fileUpload"
                data-testid="fileUpload"
                accept="application/pdf"
                onChange={(e) => setFileInput(e)}
              />
            </label>
            <button type="submit" data-testid="fileUploadButton" onClick={(e) => handleSubmit(e)}>
              Submit
            </button>
          </form>

          {isError && (
            <label className="errorTag">Please upload a valid PDF file!</label>
          )}
        </>
      )}
      {isLoading && (
        <>
          <div className="loading-container">
            <div className="loading"></div>
            <div id="loading-text">Loading</div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
