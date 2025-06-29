<template>
  <footer class="px-4 sm:px-6 py-16 relative z-10">
    <div class="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-8 sm:p-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
        <!-- Branding -->
        <div>
          <div class="flex justify-center md:justify-start items-center gap-3 mb-6">
            <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="w-12 h-12" loading="lazy" />
            <span class="text-green-800 text-2xl font-bold">Eco-Mist</span>
          </div>
          <p class="text-gray-600 mb-6">Revolutionizing aeroponics farming with IoT technology for sustainable agriculture.</p>
          <div class="flex justify-center md:justify-start space-x-5">
            <a v-for="(icon, idx) in socialIcons" :key="idx" :href="icon.link" target="_blank" class="text-gray-500 hover:text-green-600 transition-colors">
              <component :is="icon.component" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-green-800 font-semibold text-lg mb-6">Quick Links</h3>
          <ul class="space-y-4">
            <li v-for="(link, idx) in quickLinks" :key="idx">
              <a :href="link.href" class="text-gray-600 hover:text-green-600 transition-colors flex items-center justify-center md:justify-start gap-2">
                <ChevronRightIcon class="w-4 h-4 flex-shrink-0" /> {{ link.text }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-green-800 font-semibold text-lg mb-6">Resources</h3>
          <ul class="space-y-4">
            <li v-for="(link, idx) in resources" :key="idx">
              <a :href="link.href" class="text-gray-600 hover:text-green-600 transition-colors flex items-center justify-center md:justify-start gap-2">
                <ChevronRightIcon class="w-4 h-4 flex-shrink-0" /> {{ link.text }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-green-800 font-semibold text-lg mb-6">Contact</h3>
          <ul class="space-y-4">
            <li v-for="(contact, idx) in contacts" :key="idx" class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <component :is="contact.icon" class="text-green-600 w-5 h-5 flex-shrink-0" />
              <span class="text-gray-600">{{ contact.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-green-100 mt-10 pt-8 text-center">
        <p class="text-gray-600">© 2025 Eco-Mist. All rights reserved.</p>
        <div class="flex justify-center flex-wrap gap-4 mt-4">
          <a v-for="(policy, idx) in policies" :key="idx" @click="policy.onClick" class="text-gray-600 hover:text-green-600 transition-colors text-sm">{{ policy.text }}</a>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Modal -->
    <AuthPrivacy :show="showPrivacy" v-if="showPrivacy" @close="showPrivacy = false" />

    <!-- Terms of Service Modal -->
    <AuthTerms :show="showTerms" v-if="showTerms" @close="showTerms = false" />
  </footer>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import AuthPrivacy from "../Authentication/AuthPrivacy.vue";
import AuthTerms from "../Authentication/AuthTerms.vue";
import { ref } from "vue";

// Dynamic icon components
const ChevronRightIcon = defineAsyncComponent(() => import("../icons/ChevronRightIcon.vue"));
const PhoneIcon = defineAsyncComponent(() => import("../icons/PhoneIcon.vue"));
const MailIcon = defineAsyncComponent(() => import("../icons/MailIcon.vue"));
const LocationIcon = defineAsyncComponent(() => import("../icons/LocationIcon.vue"));

const FacebookIcon = defineAsyncComponent(() => import("../icons/FacebookIcon.vue"));
const TwitterIcon = defineAsyncComponent(() => import("../icons/TwitterIcon.vue"));
const InstagramIcon = defineAsyncComponent(() => import("../icons/InstagramIcon.vue"));
const LinkedInIcon = defineAsyncComponent(() => import("../icons/LinkedInIcon.vue"));

const showPrivacy = ref(false);
const showTerms = ref(false);

const socialIcons = [
  { link: "#", component: FacebookIcon },
  { link: "#", component: TwitterIcon },
  { link: "#", component: InstagramIcon },
  { link: "#", component: LinkedInIcon },
];

const quickLinks = [
  { text: "Features", href: "#features" },
  { text: "How It Works", href: "#how-it-works" },
  { text: "Benefits", href: "#benefits" },
  { text: "Contact Us", href: "#contact" },
  { text: "Login", href: "/auth" },
];

const resources = [
  { text: "Documentation", href: "#" },
  { text: "Knowledge Base", href: "#" },
  { text: "API Reference", href: "#" },
  { text: "Blog", href: "#" },
  { text: "Support", href: "#" },
];

const contacts = [
  { text: "+63 923 4567 890", icon: PhoneIcon },
  { text: "ecomist111@gmail.com", icon: MailIcon },
  { text: "Masipit, Calapan City, Oriental Mindoro", icon: LocationIcon },
];

const policies = [
  { text: "Privacy Policy", onClick: () => (showPrivacy.value = true) },
  { text: "Terms of Service", onClick: () => (showTerms.value = true) },
];
</script>
