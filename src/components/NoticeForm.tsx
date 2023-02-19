import type { FormEvent, FC } from 'react';
import { supabase } from '@/utils/supabase';
import useStore from '@/stores';
import { useMutateNotice } from '@/hooks/useMutateNotice';

export const NoticeForm: FC = () => {
  const { editedNotice } = useStore();
  const update = useStore((state) => state.updateEditedNotice);
  const { createNoticeMutation, updateNoticeMutation } = useMutateNotice();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedNotice.id === '') {
      // ID がなければ新規登録
      const res = await supabase.auth.getUser();
      const { user } = res.data;
      createNoticeMutation.mutate({
        content: editedNotice.content,
        user_id: user?.id,
      });
    } else {
      // ID があれば更新
      updateNoticeMutation.mutate({
        id: editedNotice.id,
        content: editedNotice.content,
      });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="rounted my-2 border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        placeholder="New notice ?"
        value={editedNotice.content}
        onChange={(e) => update({ ...editedNotice, content: e.target.value })}
      />
      <button className="ml-2 rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
        {editedNotice.id ? 'Update' : 'Create'}
      </button>
    </form>
  );
};
