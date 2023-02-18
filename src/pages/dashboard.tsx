/**
 * ダッシュボード
 */
import { NextPage } from 'next';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { supabase } from '@/utils/supabase';
import { Layout } from '@/components/Layout';

const Dashboard: NextPage = () => {
  const signOut = () => {
    supabase.auth.signOut();
  };
  return (
    <Layout title="Dashboard">
      <ArrowLeftOnRectangleIcon
        className="text-blur-500 mb-6 h-6 w-6 cursor-pointer"
        onClick={signOut}
      />
    </Layout>
  );
};

export default Dashboard;
