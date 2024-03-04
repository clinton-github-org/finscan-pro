import { Dispatch, SetStateAction } from 'react';

interface ResultsPage {
  setPage: Dispatch<SetStateAction<string>>;
  id: string;
}

const ResultsPage = ({ setPage, id }: ResultsPage) => {
  return (
    <>
      <h4 data-testid='resultsTitle'>Your file is uploaded and is processing! Your ID is {id}</h4>
      <p>
        Please wait for a few minutes while your file is being processed. Click
        below button to check the status
      </p>
      <button
      className='resultsButton'
        onClick={() => {
          setPage('home');
        }}
      >
        Get results
      </button>
      <button
      className='navigateButton'
        onClick={() => {
          setPage('home');
        }}
      >
        Go Back Home
      </button>
    </>
  );
};

export default ResultsPage;
