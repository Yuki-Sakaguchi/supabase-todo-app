import '@/styles/globals.css';
import type { AppProps, NextWebVitalsMetric } from 'next/app';

import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { supabase } from '@/utils/supabase';

/**
 * web vitals を計測するための処理
 */
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
      console.log(`FCP: ${Math.round(metric.value * 10) / 10}`);
      break;
    case 'LCP':
      console.log(`LCP: ${Math.round(metric.value * 10) / 10}`);
      break;
    case 'TTFB':
      console.log(`TTFB: ${Math.round(metric.value * 10) / 10}`);
      break;
    case 'Next.js-hydration':
      console.log(
        `Hydration: ${Math.round(metric.value * 10) / 10} -> ${
          Math.round((metric.startTime + metric.value) * 10) / 10
        }`
      );
      break;
    default:
      break;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  const { push, pathname } = useRouter();

  // ログインしていなかったらトップに飛ばす処理
  const validateSession = async () => {
    const user = supabase.auth.user();
    if (user && pathname === '/') {
      push('/dashboard');
    } else if (!user && pathname !== '/') {
      await push('/');
    }
  };

  // ログイン状態のセッションの変更を検知して動く処理
  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('/dashboard');
    }
    if (event === 'SIGNED_OUT') {
      push('/');
    }
  });

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />;
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
