<template>
  <nav
    class="fixed top-0 left-0 w-full z-50 px-3 sm:px-4 md:px-6 lg:px-8 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-xl"
    role="navigation"
    aria-label="Primary navigation"
    tabindex="0"
  >
    <div class="flex justify-between items-center py-2 sm:py-3 md:py-4 relative">
      <!-- Mobile Menu Toggle - always visible -->
      <button
        class="md:hidden absolute left-3 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-green-800 bg-green-100 rounded-lg active:bg-green-200 touch-manipulation"
        @click="toggleMobileMenu"
        aria-label="Toggle menu"
        aria-expanded="mobileMenuOpen"
        aria-controls="mobile-menu"
        tabindex="0"
      >
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <!-- Branding (centered on mobile) -->
      <div class="flex items-center gap-2 sm:gap-3 mx-auto md:mx-0">
        <img src="/eco-mist-logo.png" alt="Eco-Mist Logo" class="w-8 h-8 sm:w-10 sm:h-10 object-contain" loading="lazy" />
        <span class="text-green-800 text-lg sm:text-xl md:text-2xl font-bold">Eco-Mist</span>
      </div>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-4 lg:gap-8" role="menubar" aria-label="Main menu">
        <a
          v-for="link in navLinks"
          :key="link.id"
          :href="link.href"
          @click.prevent="scrollToSection(link.href.slice(1))"
          class="text-green-800 hover:text-green-600 transition-colors font-medium text-sm lg:text-base relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all hover:after:w-full"
          role="menuitem"
          tabindex="0"
        >
          {{ link.label }}
        </a>
        <router-link
          to="/auth"
          class="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-green-500/20 hover:-translate-y-0.5 transition-all shadow-lg shadow-green-600/20 active:scale-95 touch-manipulation font-medium text-sm lg:text-base whitespace-nowrap"
          role="menuitem"
          tabindex="0"
        >
          Login
        </router-link>
      </div>
    </div>

    <!-- Mobile Nav Menu (always placed just below the header) -->
    <transition
      name="mobile-menu"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-8 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-8 opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        id="mobile-menu"
        class="md:hidden absolute top-full left-0 w-full border-t border-green-100 p-4 bg-white/95 backdrop-blur-md shadow-md"
        role="menu"
        aria-label="Mobile menu"
      >
        <div class="flex flex-col space-y-4">
          <a
            v-for="link in navLinks"
            :key="link.id"
            :href="link.href"
            @click="closeMobileMenu(link.href.slice(1))"
            class="text-green-800 py-2 hover:text-green-600 transition-colors font-medium active:bg-green-50 rounded-lg px-3 touch-manipulation"
            role="menuitem"
            tabindex="0"
          >
            {{ link.label }}
          </a>
          <router-link
            to="/auth"
            @click="closeMobileMenu()"
            class="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-lg border border-green-500/20 flex items-center justify-center active:scale-95 touch-manipulation font-medium"
            role="menuitem"
            tabindex="0"
          >
            Login
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const navLinks = [
  { id: "features", label: "Features", href: "#features" },
  { id: "how-it-works", label: "How It Works", href: "#how-it-works" },
  { id: "benefits", label: "Benefits", href: "#benefits" },
  { id: "contact", label: "Contact", href: "#contact" },
];

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = (id = "") => {
  mobileMenuOpen.value = false;
  if (id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    closeMobileMenu();
  }
};
</script>
