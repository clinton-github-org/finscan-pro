/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import App from '../../App';

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
