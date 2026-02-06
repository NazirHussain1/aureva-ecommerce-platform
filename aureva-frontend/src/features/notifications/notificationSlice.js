import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    messages: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.messages.push({
        id: Date.now(),
        type: action.payload.type || 'info',
        text: action.payload.text,
      });
    },

    removeNotification: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },

    clearNotifications: (state) => {
      state.messages = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
