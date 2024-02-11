import { Dispatch, SetStateAction } from 'react';

interface ResultsPage {
  setPage: Dispatch<SetStateAction<string>>;
}

const ResultsPage = ({ setPage }: ResultsPage) => {
  return (
    <>
      <p>Results Page</p>
      <button
        onClick={() => {
          setPage('home');
        }}
      >
        Navigate
      </button>
    </>
  );
};

export default ResultsPage;
