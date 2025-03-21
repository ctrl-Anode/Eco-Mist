<template>
    <div class="chat-header">
      <h2 class="title">Eco-Mist Chat</h2>
      <div class="header-actions">
        <span class="online-count">
          {{ onlineUsers.size }} online
        </span>
        <button @click="$emit('toggle-search')" class="action-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable no-undef */
  defineProps({
    onlineUsers: {
      type: Set,
      required: true
    }
  });
  
  defineEmits(['toggle-search']);
  </script>
  
  <style scoped>
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .online-count {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  </style>