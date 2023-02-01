import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} baseUrl="api/auth/">
      <Component {...pageProps} />
      <ToastContainer style={{ zIndex: 100000 }} position="top-right" autoClose={1500} />
    </SessionProvider>);

}
