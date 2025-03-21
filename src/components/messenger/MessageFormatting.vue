<template>
    <div class="formatting-toolbar">
      <button @click="$emit('format', 'bold')" class="format-btn" title="Bold">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button @click="$emit('format', 'italic')" class="format-btn" title="Italic">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button @click="$emit('format', 'code')" class="format-btn" title="Code">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </button>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable */
  defineEmits(['format']);
  </script>
  
  <style scoped>
  .formatting-toolbar {
    display: flex;
    gap: 8px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .format-btn {
    background: transparent;
    border: none;
    color: white;
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .format-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  </style>