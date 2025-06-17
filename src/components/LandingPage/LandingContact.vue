<template>
  <section id="contact" class="px-4 sm:px-6 py-20 sm:py-24 relative z-10">
    <div class="max-w-7xl mx-auto">
      <div class="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-8 sm:p-10 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-green-800 mb-4">Ready to Transform Your Farming?</h2>
        <p class="text-gray-700 mb-8 text-lg">
          Get in touch with our team to schedule a demonstration or learn more about how Eco-Mist can revolutionize your aeroponic farming.
        </p>

        <form @submit.prevent="submitContactForm" class="text-left" aria-label="Contact form">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div class="relative group">
              <input
                id="name"
                type="text"
                v-model="contactForm.name"
                :class="{ 'pt-6': contactForm.name, 'border-red-500': formErrors.name, 'border-green-500 ring-1 ring-green-500': contactForm.name && !formErrors.name }"
                aria-required="true"
                aria-invalid="formErrors.name ? 'true' : 'false'"
                aria-describedby="name-error"
                required
                class="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              />
              <label
                for="name"
                :class="{ 'text-xs top-2': contactForm.name, 'top-1/2 -translate-y-1/2': !contactForm.name, 'text-green-600': contactForm.name && !formErrors.name, 'text-red-500': formErrors.name }"
                class="absolute left-4 text-gray-500 transition-all pointer-events-none"
              >
                Full Name
              </label>
              <p v-if="formErrors.name" id="name-error" class="text-red-600 text-sm mt-1">{{ formErrors.name }}</p>
            </div>
            <div class="relative group">
              <input
                id="email"
                type="email"
                v-model="contactForm.email"
                :class="{ 'pt-6': contactForm.email, 'border-red-500': formErrors.email, 'border-green-500 ring-1 ring-green-500': contactForm.email && !formErrors.email }"
                aria-required="true"
                aria-invalid="formErrors.email ? 'true' : 'false'"
                aria-describedby="email-error"
                required
                class="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              />
              <label
                for="email"
                :class="{ 'text-xs top-2': contactForm.email, 'top-1/2 -translate-y-1/2': !contactForm.email, 'text-green-600': contactForm.email && !formErrors.email, 'text-red-500': formErrors.email }"
                class="absolute left-4 text-gray-500 transition-all pointer-events-none"
              >
                Email Address
              </label>
              <p v-if="formErrors.email" id="email-error" class="text-red-600 text-sm mt-1">{{ formErrors.email }}</p>
            </div>
          </div>

          <div class="relative mb-6 group">
            <textarea
              id="message"
              v-model="contactForm.message"
              :class="{ 'pt-8': contactForm.message, 'border-red-500': formErrors.message, 'border-green-500 ring-1 ring-green-500': contactForm.message && !formErrors.message }"
              aria-required="true"
              aria-invalid="formErrors.message ? 'true' : 'false'"
              aria-describedby="message-error"
              required
              rows="4"
              class="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all resize-y"
            ></textarea>
            <label
              for="message"
              :class="{ 'text-xs top-2': contactForm.message, 'top-4': !contactForm.message, 'text-green-600': contactForm.message && !formErrors.message, 'text-red-500': formErrors.message }"
              class="absolute left-4 text-gray-500 transition-all pointer-events-none"
            >
              Your Message
            </label>
            <p v-if="formErrors.message" id="message-error" class="text-red-600 text-sm mt-1">{{ formErrors.message }}</p>
          </div>

          <button
            type="submit"
            :disabled="submitting"
            aria-busy="submitting"
            class="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold px-6 py-4 rounded-xl hover:-translate-y-1 transition-transform shadow-lg shadow-green-600/20 active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <span v-if="!submitting">Send Message</span>
            <span v-else class="inline-flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          </button>
          <div class="mt-4">
            <p v-if="successMessage" class="text-green-600 text-center font-medium" role="alert">{{ successMessage }}</p>
            <p v-if="errorMessage" class="text-red-600 text-center font-medium" role="alert">{{ errorMessage }}</p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Corrected the path to Firebase configuration

const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const contactForm = reactive({
  name: '',
  email: '',
  message: ''
});

const formErrors = reactive({
  name: '',
  email: '',
  message: ''
});

const validateForm = () => {
  let valid = true;

  if (!contactForm.name.trim()) {
    formErrors.name = 'Full Name is required.';
    valid = false;
  } else if (contactForm.name.trim().length < 3) {
    formErrors.name = 'Full Name must be at least 3 characters.';
    valid = false;
  } else {
    formErrors.name = '';
  }

  if (!contactForm.email.trim()) {
    formErrors.email = 'Email Address is required.';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
    formErrors.email = 'Please enter a valid email address.';
    valid = false;
  } else {
    formErrors.email = '';
  }

  if (!contactForm.message.trim()) {
    formErrors.message = 'Message is required.';
    valid = false;
  } else if (contactForm.message.trim().length < 10) {
    formErrors.message = 'Message must be at least 10 characters.';
    valid = false;
  } else {
    formErrors.message = '';
  }

  return valid;
};

const submitContactForm = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  submitting.value = true;

  try {
    await addDoc(collection(db, 'contact_messages'), {
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      timestamp: Timestamp.now(),
    });

    contactForm.name = '';
    contactForm.email = '';
    contactForm.message = '';

    successMessage.value = 'Thank you for your message! We will get back to you soon.';
    errorMessage.value = '';
  } catch (error) {
    console.error('Error submitting contact form:', error);
    errorMessage.value = 'Failed to send your message. Please try again later.';
    successMessage.value = '';
  } finally {
    submitting.value = false;
  }
};
</script>
