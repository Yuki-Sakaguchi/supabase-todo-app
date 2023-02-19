import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import useStore from '@/stores';
import { Notice } from '@/types/types';
import { useMutateNotice } from '@/hooks/useMutateNotice';
import { supabase } from '@/utils/supabase';

export const NoticeItem: FC<Omit<Notice, 'created_at'>> = ({
  id,
  content,
  user_id,
}) => {
  const [userId, setUserId] = useState<string | undefined>('');
  const update = useStore((state) => state.updateEditedNotice);
  const { deleteNoticeMutation } = useMutateNotice();

  useEffect(() => {
    const getUser = async () => {
      const res = await supabase.auth.getUser();
      const { user } = res.data;
      setUserId(user?.id);
    };
    getUser();
  }, []);

  return (
    <li className="my-3 text-lg font-extrabold">
      <span>{content}</span>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => update({ id, content })}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => deleteNoticeMutation.mutate(id)}
          />
        </div>
      )}
    </li>
  );
};
