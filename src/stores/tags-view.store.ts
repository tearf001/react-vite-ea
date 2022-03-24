import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TagState } from '@/interface/layout/tagsView.interface';
import { RootState } from '.';

const initialState: TagState = {
  activeTagId: '',
  tags: [],
  reloadPath: 'null',
};

const tagsViewSlice = createSlice({
  name: 'tagsView',
  initialState,
  reducers: {
    setActiveTag(state, action: PayloadAction<string>) {
      state.activeTagId = action.payload;
    },
    addTag(state, action: PayloadAction<string>) {
      if (!state.tags.find(tag => tag === action.payload)) {
        state.tags.push(action.payload);
      }

      state.activeTagId = action.payload;
    },
    setTabs(state, action: PayloadAction<string[]>) {
      state.tags = action.payload;
    },
    setReloadPath(state, action: PayloadAction<string>) {
      state.reloadPath = action.payload;
    },
    removeTag(state, action: PayloadAction<string>) {
      const targetKey = action.payload;
      // dashboard cloud't be closed

      if (targetKey === state.tags[0]) {
        return;
      }

      const activeTagId = state.activeTagId;
      let lastIndex = 0;

      state.tags.forEach((tag, i) => {
        if (tag === targetKey) {
          state.tags.splice(i, 1);
          lastIndex = i - 1;
        }
      });
      const tagList = state.tags.filter(tag => tag !== targetKey);

      if (tagList.length && activeTagId === targetKey) {
        if (lastIndex >= 0) {
          state.activeTagId = tagList[lastIndex];
        } else {
          state.activeTagId = tagList[0];
        }
      }
    },
    removeAllTag(state) {
      state.activeTagId = state.tags[0];
      state.tags = [state.tags[0]];
    },
    removeOtherTag(state) {
      const activeTag = state.tags.find(tag => tag === state.activeTagId);
      const activeIsDashboard = activeTag! === state.tags[0];

      state.tags = activeIsDashboard ? [state.tags[0]] : [state.tags[0], activeTag!];
    },
  },
});

export const { setActiveTag, addTag, removeTag, removeAllTag, removeOtherTag, setTabs, setReloadPath } =
  tagsViewSlice.actions;

export const selectTabs = (state: RootState) => state.tagsView.tags;
export const selectCurrentTab = (state: RootState) => state.tagsView.activeTagId;
export const selectReloadPath = (state: RootState) => state.tagsView.reloadPath;

export default tagsViewSlice.reducer;
