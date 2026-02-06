// notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    messages: [], // Array of notifications { id, type, text }
  },
  reducers: {
    // Add a new notification
    addNotification: (state, action) => {
      state.messages.push({
        id: Date.now(), // unique id
        type: action.payload.type || 'info', // info, success, error, warning
        text: action.payload.text,
      });
    },

    // Remove a notification by ID
    removeNotification: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.messages = [];
    },
  },
});

// Export actions
export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;

// Export reducer
export default notificationSlice.reducer;
