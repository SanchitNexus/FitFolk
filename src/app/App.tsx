import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import DemoProvider from './providers/DemoContext';
import ThemeProvider from './providers/ThemeContext';
import ToastProvider from './providers/ToastContext';

export default function App() {
  return (
    <ToastProvider>
      <DemoProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </DemoProvider>
    </ToastProvider>
  );
}
