import { Dispatch, SetStateAction } from 'react';

interface HomePage {
  setPage: Dispatch<SetStateAction<string>>;
}

const HomePage = ({ setPage }: HomePage) => {
  return (
    <>
      <h4>Upload your bank statement for analysis!</h4>
      <form action="" method="post">
        <label htmlFor="fileUpload" id="fileUploadLabel">
          <span>Drop files here</span>
          or
          <input type="file" name="fileUpload" id="fileUpload" accept=".pdf" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default HomePage;
