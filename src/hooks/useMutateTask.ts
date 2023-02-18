import { useQueryClient, useMutation } from 'react-query';
import useStote from '@/stores';
import { supabase } from '@/utils/supabase';
import { Task, EditedTask } from '@/types/types';

export const useMutateTask = () => {
  const queryClient = useQueryClient();
  const reset = useStote((state) => state.resetEditedTask);

  // タスクを作成する
  const createTaskMutation = useMutation(
    async (task: Omit<Task, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('todos')
        .insert(task)
        .select();
      if (error) throw new Error(error.message);
      return data;
    },
    {
      /**
       * 処理に成功した場合、キャッシュのデータを取得して
       * キャッシュが存在すれば後ろに追加する
       */
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos');
        if (previousTodos && res != null) {
          queryClient.setQueryData('todos', [...previousTodos, res[0]]);
        }
        reset();
      },
      onError(err: any) {
        alert(err.message);
        reset();
      },
    }
  );

  // タスクを更新する
  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ title: task.title })
        .eq('id', task.id)
        .select();
      if (error) throw new Error(error.message);
      console.log(data);
      return data;
    },
    {
      /**
       * 処理に成功した場合、キャッシュのデータを取得して
       * キャッシュが存在すればデータを入れ替える
       */
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos');
        if (previousTodos && res != null) {
          const newTodos = previousTodos.map((task) =>
            task.id === variables.id ? res[0] : task
          );
          queryClient.setQueryData('todos', newTodos);
        }
        reset();
      },
      onError(err: any) {
        alert(err.message);
        reset();
      },
    }
  );

  // タスクを削除する
  const deleteTaskMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      /**
       * 処理に成功した場合、キャッシュのデータを取得して
       * キャッシュが存在すればデータを削除する
       */
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('todos');
        if (previousTodos) {
          queryClient.setQueryData(
            'todos',
            previousTodos.filter((task) => task.id !== variables)
          );
        }
        reset();
      },
      onError(err: any) {
        alert(err.message);
        reset();
      },
    }
  );

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};
