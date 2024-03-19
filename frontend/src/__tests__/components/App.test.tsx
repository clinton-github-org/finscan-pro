/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import {
  cleanup,
  render,
  screen
} from '@testing-library/react';
import App from '../../App';

// const fakeFile = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

afterEach(() => {
  cleanup();
});

describe('renders App component', () => {
  beforeEach(() => {
    render(<App />);
  });
  afterEach(() => {
    cleanup();
  });

  it('renders main site', () => {
    const textElement = screen.getByRole('main');
    expect(textElement).toBeInTheDocument();
  });

  it('renders heading logo', () => {
    const headingLogo = screen.getByRole('heading', { name: /FinScan Pro/i });
    expect(headingLogo).toBeInTheDocument();
  });
});

describe('renders HomePage when page is home by default', () => {
  beforeEach(() => {
    render(<App />);
  });
  afterEach(() => {
    cleanup();
  });

  it('renders homepage by default', () => {
    const textElement = screen.getByText(
      'Upload your bank statement for analysis!'
    );
    expect(textElement).toBeInTheDocument();
  });

  it('renders form', () => {
    const formElement = screen.getByTestId('uploadForm');
    expect(formElement).toBeInTheDocument();
  });

  it('should not render results page', () => {
    const resultsPage = screen.queryByText('Results Page');
    expect(resultsPage).toBeNull();
  });
});


// eslint-disable-next-line jest/no-commented-out-tests
// describe('should render results page properly', () => {
//   beforeEach(async () => {
//     render(<App />);
//     await act(async () => {
//       const inputElement = screen.getByTestId('fileUpload');
//       fireEvent.change(inputElement, {
//         target: {
//           files: 'fakeFile',
//         },
//       });
//       const submitElement = screen.getByTestId('fileUploadButton');
//       fireEvent.click(submitElement);
//       await new Promise((resolve) => setTimeout(resolve, 6000));
//     });
//   }, 7000);

// eslint-disable-next-line jest/no-commented-out-tests
//   it('should render results page', () => {
//     const resultsTitle = screen.getByTestId('resultsTitle');
//     expect(resultsTitle).toBeInTheDocument();
//   });

// eslint-disable-next-line jest/no-commented-out-tests
//   it('should render get results button', () => {
//     const resultsButton = screen.getByText('Get results');
//     expect(resultsButton).toBeInTheDocument();
//   });
// });
