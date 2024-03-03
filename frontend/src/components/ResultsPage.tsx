import { Dispatch, SetStateAction } from 'react';

interface ResultsPage {
  setPage: Dispatch<SetStateAction<string>>;
  id: string
}

const ResultsPage = ({ setPage, id }: ResultsPage) => {
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
      {id.length > 0 && <p>Results here</p>}
    </>
  );
};

export default ResultsPage;
