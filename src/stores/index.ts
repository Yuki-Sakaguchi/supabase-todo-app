import { create } from 'zustand';
import { EditedTask, EditedNotice } from '@/types/types';

type State = {
  editedTask: EditedTask;
  editedNotice: EditedNotice;
  updateEditedTask: (payload: EditedTask) => void;
  updateEditedNotice: (payload: EditedNotice) => void;
  resetEditedTask: () => void;
  resetEditedNotice: () => void;
};

const useStore = create<State>((set) => ({
  editedTask: { id: '', title: '' },
  editedNotice: { id: '', content: '' },
  updateEditedTask: (payload) => {
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
      },
    });
  },
  updateEditedNotice: (payload) => {
    set({
      editedNotice: {
        id: payload.id,
        content: payload.content,
      },
    });
  },
  resetEditedTask: () => set({ editedTask: { id: '', title: '' } }),
  resetEditedNotice: () => set({ editedNotice: { id: '', content: '' } }),
}));

export default useStore;
