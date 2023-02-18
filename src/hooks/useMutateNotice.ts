import { useQueryClient, useMutation } from 'react-query';
import useStote from '@/stores';
import { supabase } from '@/utils/supabase';
import { Notice, EditedNotice } from '@/types/types';

export const useMutateNotice = () => {
  const queryClient = useQueryClient();
  const reset = useStote((state) => state.resetEditedNotice);

  // お知らせを作成する
  const createNoticeMutation = useMutation(
    async (notice: Omit<Notice, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('notices').insert(notice);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      /**
       * 処理に成功した場合、キャッシュのデータを取得して
       * キャッシュが存在すれば後ろに追加する
       */
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Notice[]>('notices');
        if (previousTodos && res != null) {
          queryClient.setQueryData('notices', [...previousTodos, res[0]]);
        }
        reset();
      },
      onError(err: any) {
        alert(err.message);
        reset();
      },
    }
  );

  // お知らせを更新する
  const updateNoticeMutation = useMutation(
    async (notice: EditedNotice) => {
      const { data, error } = await supabase
        .from('notices')
        .update({ title: notice.content })
        .eq('id', notice.id);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      /**
       * 処理に成功した場合、キャッシュのデータを取得して
       * キャッシュが存在すればデータを入れ替える
       */
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Notice[]>('notices');
        if (previousTodos && res != null) {
          queryClient.setQueryData(
            'notices',
            previousTodos.map((notice) => {
              notice.id === variables.id ? res[0] : notice;
            })
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

  // お知らせを削除する
  const deleteNoticeMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notices')
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
        const previousTodos = queryClient.getQueryData<Notice[]>('notices');
        if (previousTodos) {
          queryClient.setQueryData(
            'notices',
            previousTodos.filter((notice) => notice.id !== variables)
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
    createNoticeMutation,
    updateNoticeMutation,
    deleteNoticeMutation,
  };
};
