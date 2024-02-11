import { Dispatch, SetStateAction, useState } from 'react';
import uploadFile from '../services/uploadFile';

interface HomePage {
  setPage: Dispatch<SetStateAction<string>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomePage = ({ setPage }: HomePage) => {
  const [isLoading, setIsLoading] = useState(false);

  // File Upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await uploadFile(); 
      console.log('API response:', response);
      setIsLoading(false);
      setPage('home');
    } catch (error) {
      console.error('API error:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isLoading && (
        <>
          <h4>Upload your bank statement for analysis!</h4>
          <form method="post" data-testid="uploadForm" onSubmit={handleSubmit}>
            <label htmlFor="fileUpload" id="fileUploadLabel">
              <span>Drop files here</span>
              or
              <input
                type="file"
                name="fileUpload"
                id="fileUpload"
                accept=".pdf"
              />
            </label>
            <button type="submit" >
              Submit
            </button>
          </form>
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
