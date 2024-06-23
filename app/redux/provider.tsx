'use client'
import { ReactNode } from 'react'; // Import ReactNode type
import { Provider } from 'react-redux';
import { store } from './store';

interface ProvidersProps {
  children: ReactNode; // Define children prop with ReactNode type
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
