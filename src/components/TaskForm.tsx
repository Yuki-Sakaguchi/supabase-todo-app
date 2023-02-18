import type { FormEvent, FC } from 'react';
import { supabase } from '@/utils/supabase';
import useStore from '@/stores/index';
import { useMutateTask } from '@/hooks/useMutateTask';

export const TaskForm: FC = () => {
  const { editedTask } = useStore();
  const update = useStore((state) => state.updateEditedTask);
  const { createTaskMutation, updateTaskMutation } = useMutateTask();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedTask.id === '') {
      // ID がなければ新規登録
      const res = await supabase.auth.getUser();
      const { user } = res.data;
      createTaskMutation.mutate({
        title: editedTask.title,
        user_id: user?.id,
      });
    } else {
      // ID があれば更新
      updateTaskMutation.mutate({
        id: editedTask.id,
        title: editedTask.title,
      });
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="rounted my-2 border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        placeholder="New task ?"
        value={editedTask.title}
        onChange={(e) => update({ ...editedTask, title: e.target.value })}
      />
      <button className="ml-2 rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
        {editedTask.id ? 'Update' : 'Create'}
      </button>
    </form>
  );
};
