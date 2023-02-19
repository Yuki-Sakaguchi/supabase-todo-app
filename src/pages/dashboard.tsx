/**
 * ダッシュボード
 */
import { NextPage } from 'next';
import {
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  BellIcon,
} from '@heroicons/react/24/solid';
import { supabase } from '@/utils/supabase';
import { Layout } from '@/components/Layout';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { NoticeList } from '@/components/NoticeList';
import { NoticeForm } from '@/components/NoticeForm';

const Dashboard: NextPage = () => {
  const signOut = () => {
    supabase.auth.signOut();
  };
  return (
    <Layout title="Dashboard">
      <ArrowLeftOnRectangleIcon
        className="text-blur-500 mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <div className="grid grid-cols-2 gap-40">
        <div>
          <div className="my-3 flex justify-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          </div>
          <TaskForm />
          <TaskList />
        </div>
        <div>
          <div className="my-3 flex justify-center">
            <BellIcon className="h-8 w-8 text-blue-500" />
          </div>
          <NoticeForm />
          <NoticeList />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
