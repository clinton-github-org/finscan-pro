import { Dispatch, SetStateAction } from 'react';

interface HomePage {
  setPage: Dispatch<SetStateAction<string>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomePage = ({ setPage }: HomePage) => {
  return (
    <>
      <h4>Upload your bank statement for analysis!</h4>
      <form method="post" data-testid="uploadForm">
        <label htmlFor="fileUpload" id="fileUploadLabel">
          <span>Drop files here</span>
          or
          <input type="file" name="fileUpload" id="fileUpload" accept=".pdf" />
        </label>
        <button type="submit" onClick={() => setPage('home')}>Submit</button>
      </form>
    </>
  );
};

export default HomePage;
