<template>
    <div class="reactions">
      <div v-for="(group, emoji) in groupedReactions" 
           :key="emoji"
           class="reaction-group"
           :class="{ 'user-reacted': hasUserReacted(emoji) }"
           :title="getReactionTitle(group)"
           @click="handleReactionClick(emoji)">
        <span class="emoji">{{ emoji }}</span>
        <span class="count">{{ group.length }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable no-undef */
  import { computed } from 'vue';
  
  defineProps({
    reactions: {
      type: Array,
      required: true
    },
    messageId: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  });
  
  defineEmits(['add-reaction', 'remove-reaction']);
  
  const groupedReactions = computed(() => {
    return props.reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = [];
      }
      acc[reaction.emoji].push(reaction);
      return acc;
    }, {});
  });
  
  const hasUserReacted = (emoji) => {
    return props.reactions.some(r => r.emoji === emoji && r.userId === props.user?.uid);
  };
  
  const handleReactionClick = (emoji) => {
    const existingReaction = props.reactions.find(
      r => r.emoji === emoji && r.userId === props.user?.uid
    );
    
    if (existingReaction) {
      emit('remove-reaction', props.messageId, existingReaction.id);
    } else {
      emit('add-reaction', props.messageId, emoji);
    }
  };
  
  const getReactionTitle = (group) => {
    const users = group.map(r => r.username).join(', ');
    return `Reacted by: ${users}`;
  };
  </script>
  
  <style scoped>
  .reactions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }
  
  .reaction-group {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .reaction-group:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .count {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .reaction-group.user-reacted {
    background: rgba(74, 222, 128, 0.2);
    border: 1px solid rgba(74, 222, 128, 0.3);
  }
  </style>
  
  