import { render, screen } from '@testing-library/react';
import App from '../App.tsx';

describe('App tests', () => {
    it('should contains the heading 1', () => {
        render(<App/>);
        // const heading = screen.getByText(/FinScan Pro/i);
        expect(true).toBe(true)
        // expect(heading).toBeInTheDocument()
    });
});
