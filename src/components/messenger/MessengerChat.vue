<template>
  <div class="chat-wrapper">
    <!-- Enhanced Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
      <div class="gradient-circle c4"></div>
    </div>

    <!-- Improved Glass Card -->
    <div class="glass-card">
      <div class="card-header">
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="leaf-icon">
            <path d="M2 22c1.25-1.25 2.5-2.5 3.5-4 .83-1.25 1.5-2.5 2-4 .5-1.5.5-3 0-4.5-.5-1.5-1.5-3-3-4.5 1.5 1 3 1.5 4.5 2 1.67.5 3.33.5 5 0 1.67-.5 3.17-1.5 4.5-3 0 1.5-.5 3-1.5 4.5s-2.17 2.67-3.5 3.5c-1.33.83-2.67 1.33-4 1.5-1.33.17-2.67.17-4-.5 1 1 1.5 2.5 1.5 4.5 0 2-1 4-3 6Z"/>
          </svg>
          <h2 class="title">Eco-Mist Chat</h2>
        </div>
        <div class="online-indicator">
          <span class="pulse"></span>
          <span>Online</span>
        </div>
      </div>
      
      <div class="card-content">
        <div class="messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </div>
          
          <div v-for="(msg, index) in messages" :key="msg.id" 
               :class="[
                 'message-bubble',
                 {'my-message': msg.userId === user.uid, 'other-message': msg.userId !== user.uid},
                 {'grouped': isGroupedMessage(msg, index)}
               ]">
            <div class="avatar" v-if="!isGroupedMessage(msg, index) && msg.userId !== user.uid">
              {{ getInitials(msg.username) }}
            </div>
            <div class="message-content">
              <div class="message-header" v-if="!isGroupedMessage(msg, index)">
                <strong>{{ msg.username }}</strong>
              </div>
              <p class="message-text">{{ msg.text }}</p>
              <span class="timestamp">{{ formatTimestamp(msg.timestamp) }}</span>
            </div>
          </div>
        </div>
        
        <div class="typing-indicator" v-if="isTyping">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div class="input-container">
          <div class="input-group">
            <input 
              v-model="newMessage" 
              @keyup.enter="sendMessage" 
              @focus="handleFocus"
              @blur="handleBlur"
              placeholder="Type a message..." 
              :class="{ 'is-filled': newMessage }"
              autofocus 
            />
            <label>Message</label>
            <span class="input-border"></span>
          </div>
          <button 
            @click="sendMessage" 
            class="send-btn" 
            :disabled="!newMessage.trim()"
            aria-label="Send message"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';//, computed
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();
const user = auth.currentUser;
const messages = ref([]);
const newMessage = ref("");
const messagesContainer = ref(null);
const isTyping = ref(false);

// Fetch messages in real-time
onMounted(() => {
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    nextTick(() => scrollToBottom());
  });
});

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  
  try {
    await addDoc(collection(db, "messages"), {
      text: newMessage.value,
      userId: user.uid,
      username: user.displayName || "Anonymous",
      timestamp: new Date()
    });
    newMessage.value = "";
    nextTick(() => scrollToBottom());
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTo({ 
        top: messagesContainer.value.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, 100);
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString();
};

// Check if message should be grouped with previous message
const isGroupedMessage = (message, index) => {
  if (index === 0) return false;
  
  const prevMessage = messages.value[index - 1];
  const timeDiff = message.timestamp.seconds - prevMessage.timestamp.seconds;
  
  // Group if same user and less than 2 minutes apart
  return message.userId === prevMessage.userId && timeDiff < 120;
};

// Get initials for avatar
const getInitials = (name) => {
  if (!name) return "A";
  return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
};

// Typing indicator simulation
const handleFocus = () => {
  // Simulate other user typing when you focus the input
  if (Math.random() > 0.5) {
    setTimeout(() => {
      isTyping.value = true;
      setTimeout(() => {
        isTyping.value = false;
      }, 3000);
    }, 1000);
  }
};

const handleBlur = () => {
  // Optional: do something when input loses focus
};
</script>

<style scoped>
.chat-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.gradient-bg {
  position: fixed;
  inset: 0;
  background: #0c1120;
  z-index: 0;
  overflow: hidden;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: float 25s infinite ease-in-out;
}

.c1 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle at center, #22c55e, #16a34a);
  top: -250px;
  left: -200px;
  animation-delay: 0s;
}

.c2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at center, #15803d, #166534);
  bottom: -200px;
  right: -150px;
  animation-delay: -7s;
}

.c3 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #4ade80, #22c55e);
  top: 60%;
  left: 30%;
  animation-delay: -14s;
}

.c4 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at center, #059669, #047857);
  top: 20%;
  right: 20%;
  animation-delay: -20s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(70px, -70px);
  }
  50% {
    transform: translate(20px, 100px);
  }
  75% {
    transform: translate(-70px, -40px);
  }
}

.glass-card {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 650px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  overflow: hidden;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  animation: shine 8s infinite linear;
}

@keyframes shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.leaf-icon {
  color: #4ade80;
}

.title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, #ffffff, #4ade80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.pulse {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  position: relative;
}

.pulse::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  70% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.card-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 40px 0;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.6;
}

.message-bubble {
  display: flex;
  gap: 12px;
  max-width: 85%;
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

.my-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.other-message {
  align-self: flex-start;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #15803d, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.my-message .message-content {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.2);
}

.other-message .message-content {
  background: rgba(255, 255, 255, 0.08);
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grouped {
  margin-top: -4px;
}

.grouped .message-content {
  border-radius: 18px;
}

.my-message.grouped .message-content {
  border-bottom-right-radius: 4px;
}

.other-message.grouped .message-content {
  border-bottom-left-radius: 4px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-header {
  margin-bottom: 4px;
}

.my-message .message-header strong {
  color: rgba(255, 255, 255, 0.9);
}

.other-message .message-header strong {
  color: rgba(255, 255, 255, 0.9);
}

.message-text {
  color: white;
  margin: 0;
  word-break: break-word;
  font-size: 0.95rem;
  line-height: 1.4;
}

.timestamp {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  display: block;
  text-align: right;
  margin-top: 4px;
}

.typing-indicator {
  padding: 0 20px 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  display: inline-block;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.input-container {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
}

.input-group {
  position: relative;
  flex: 1;
}

.input-group input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  transition: all 0.3s;
  outline: none;
  height: 50px;
}

.input-group input:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(74, 222, 128, 0.5);
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
}

.input-group label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  transition: all 0.3s;
}

.input-group input:focus + label,
.input-group input.is-filled + label {
  top: 0;
  left: 12px;
  font-size: 12px;
  padding: 0 4px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  color: #4ade80;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #4ade80;
  transition: all 0.3s;
}

.input-group input:focus ~ .input-border {
  width: 100%;
}

.send-btn {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  border-radius: 12px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(22, 163, 74, 0.2);
  position: relative;
  overflow: hidden;
}

.send-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
  opacity: 0;
  transition: opacity 0.3s;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.send-btn:hover::before {
  opacity: 1;
}

.send-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
}

.send-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .chat-wrapper {
    padding: 10px;
  }
  
  .glass-card {
    height: 85vh;
    max-width: 100%;
    border-radius: 20px;
  }
  
  .card-header {
    padding: 16px;
  }
  
  .title {
    font-size: 1.3rem;
  }
  
  .messages {
    padding: 16px;
  }
  
  .message-bubble {
    max-width: 90%;
  }
  
  .input-container {
    padding: 12px 16px;
  }
  
  .input-group input {
    padding: 12px 16px;
  }
  
  .send-btn {
    width: 46px;
    height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle {
    animation: none;
  }
  
  .glass-card::before {
    animation: none;
  }
  
  .message-bubble {
    animation: none;
  }
  
  .pulse::after {
    animation: none;
  }
  
  .typing-indicator span {
    animation: none;
  }
}
</style>