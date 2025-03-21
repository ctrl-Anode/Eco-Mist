<template>
    <div class="message-content">
      <div class="message-header">
        <strong>{{ message.username }}</strong>
        <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
      </div>
      
      <p class="message-text" v-html="formatMessageText(message.text)"></p>
      
      <!-- Attachments -->
      <div v-if="message.attachments?.length" class="attachments">
        <div v-for="file in message.attachments" 
             :key="file.url" 
             class="attachment">
          <img v-if="file.type.startsWith('image/')" 
               :src="file.url" 
               @click="openImagePreview(file.url)"
          />
          <a v-else :href="file.url" target="_blank" class="file-link">
            {{ file.name }}
          </a>
        </div>
      </div>
      
      <!-- Voice Message -->
      <audio v-if="message.voiceMessage" 
             :src="message.voiceMessage" 
             controls 
             class="voice-message"
      ></audio>
      
      <!-- Message Actions -->
      <div v-if="showActions && !isReply" class="message-actions">
        <button @click="$emit('reply', message.id)" class="action-btn">
          Reply
        </button>
        <button @click="showReactions = !showReactions" class="action-btn">
          React
        </button>
        <button v-if="isMine" 
                @click="$emit('delete', message.id)" 
                class="action-btn delete">
          Delete
        </button>
      </div>
      
      <!-- Reaction Picker -->
      <div v-if="showReactions" class="reaction-picker">
        <button v-for="emoji in ['👍', '❤️', '😄', '😮', '😢', '👏']"
                :key="emoji"
                @click="addReaction(emoji)"
                class="emoji-btn">
          {{ emoji }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable no-undef */
  import { ref } from 'vue';
  import DOMPurify from 'dompurify';
  import { marked } from 'marked';
  
  const props = defineProps({
    message: {
      type: Object,
      required: true
    },
    isMine: {
      type: Boolean,
      required: true
    },
    isReply: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['reply', 'react', 'delete']);
  
  const showReactions = ref(false);
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.seconds ? 
      new Date(timestamp.seconds * 1000) : 
      new Date(timestamp);
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleDateString();
  };
  
  const formatMessageText = (text) => {
    // Convert markdown to HTML
    let html = marked(text);
    // Sanitize HTML
    html = DOMPurify.sanitize(html);
    return html;
  };
  
  const addReaction = (emoji) => {
    emit('react', props.message.id, emoji);
    showReactions.value = false;
  };
  
  const openImagePreview = (url) => {
    // TODO: Implement image preview modal
    window.open(url, '_blank');
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  
  