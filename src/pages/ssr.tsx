/**
 * Supabase のデータを使って SSR でデータを組み込んだページを作る
 */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPage, GetServerSideProps } from 'next';

import { Layout } from '@/components/Layout';
import { supabase } from '@/utils/supabase';
import { Task, Notice } from '@/types/types';

export const getServerSideProps: GetServerSideProps = async () => {
  console.log('getServerSideProps/ssr invoked');
  const { data: tasks } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true });
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: true });
  return { props: { tasks, notices } };
};

type StaticProps = {
  tasks: Task[];
  notices: Notice[];
};

const Ssr: NextPage<StaticProps> = ({ tasks, notices }) => {
  const router = useRouter();
  return (
    <Layout title="SSR">
      <p className="mb-3 text-pink-500">SSR</p>
      <ul className="mb-3">
        {tasks.map((task) => {
          return (
            <li key={task.id}>
              <p className="text-lg font-extrabold">{task.title}</p>
            </li>
          );
        })}
      </ul>
      <ul className="mb-3">
        {notices.map((notice) => {
          return (
            <li key={notice.id}>
              <p className="text-lg font-extrabold">{notice.content}</p>
            </li>
          );
        })}
      </ul>
      <Link href="/ssg" prefetch={false}>
        <span className="mb-3 text-xs">Link to ssg</span>
      </Link>
      <Link href="/isr" prefetch={false}>
        <span className="mb-3 text-xs">Link to isr</span>
      </Link>
      <button className="mb-3 text-xs" onClick={() => router.push('/ssg')}>
        Route to ssg
      </button>
    </Layout>
  );
};

export default Ssr;
