import { Toaster } from 'react-hot-toast';

function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          border: '1px solid #000',
          padding: '16px',
          color: '#000',
          backgroundColor: '#fff',
        },
        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },
      }}
    />
  );
}

export default Toast;
