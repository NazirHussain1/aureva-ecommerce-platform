import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: action.payload.id || Date.now(),
        type: action.payload.type || 'info',
        message: action.payload.message || action.payload.text,
        isRead: action.payload.isRead || false,
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      state.items.unshift(notification);
      if (!notification.isRead) {
        state.unreadCount += 1;
      }
    },

    removeNotification: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount -= 1;
      }
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    markAsRead: (state, action) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },

    markAllAsRead: (state) => {
      state.items.forEach(item => {
        item.isRead = true;
      });
      state.unreadCount = 0;
    },

    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(item => !item.isRead).length;
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const { 
  addNotification, 
  removeNotification, 
  markAsRead, 
  markAllAsRead, 
  setNotifications, 
  clearNotifications 
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

export default notificationSlice.reducer;
