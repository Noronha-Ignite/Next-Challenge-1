import { AppProps } from 'next/app';
import { PostContextWrapper } from '../hooks/usePosts';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <PostContextWrapper>
      <Component {...pageProps} />
    </PostContextWrapper>
  );
}

export default MyApp;
