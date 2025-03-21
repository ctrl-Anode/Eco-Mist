<template>
    <div class="search-container">
      <div class="search-input-group">
        <input 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          placeholder="Search messages..." 
          class="search-input"
        />
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <select 
        :value="filter"
        @change="$emit('update:filter', $event.target.value)"
        class="filter-select"
      >
        <option value="all">All Messages</option>
        <option value="files">Files & Media</option>
        <option value="links">Links</option>
      </select>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable no-undef */
  defineProps({
    modelValue: String,
    filter: String
  });
  
  defineEmits(['update:modelValue', 'update:filter', 'close']);
  </script>
  
  <style scoped>
  .search-container {
    margin-bottom: 16px;
    display: flex;
    gap: 8px;
  }
  
  .search-input-group {
    position: relative;
    flex: 1;
  }
  
  .search-input {
    width: 100%;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 8px;
    color: white;
  }
  
  .filter-select {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 8px;
    color: white;
    padding: 8px;
  }
  
  .close-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }
  </style>