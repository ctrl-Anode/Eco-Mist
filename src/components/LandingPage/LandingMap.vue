<template>
  <section id="location" class="px-4 sm:px-6 py-20 sm:py-24 relative z-10">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">Find Us</h2>
        <div class="w-24 h-1.5 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full mb-6"></div>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">Search for a location to see our nearest service centers or enter your address to get directions.</p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="mb-6 relative">
          <input
            v-model="searchQuery"
            @keyup.enter="searchPlace"
            type="text"
            placeholder="Search for a place or address..."
            class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-14 text-gray-700 bg-white/95 backdrop-blur-sm"
          />
          <button
            @click="searchPlace"
            class="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md"
            :disabled="isSearching"
          >
            <span v-if="isSearching" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="sr-only">Searching...</span>
            </span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        <div v-if="searchError" class="mt-2 text-red-500 text-sm bg-red-100 p-2 rounded-lg">{{ searchError }}</div>

        <div v-if="suggestions.length > 0" class="mt-2 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <ul>
            <li v-for="(suggestion, index) in suggestions" :key="index" class="p-3 border-b border-gray-100 last:border-b-0 hover:bg-green-50 cursor-pointer transition-colors" @click="selectSuggestion(suggestion)">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ suggestion }}</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl overflow-hidden shadow-xl border-4 border-white relative mt-6">
          <div v-if="isMapLoading" class="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div class="flex flex-col items-center">
              <svg class="animate-spin h-10 w-10 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-600">Loading map...</p>
            </div>
          </div>
          <iframe
            ref="mapIframe"
            :src="mapUrl"
            width="100%"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full"
            @load="handleMapLoad"
          ></iframe>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="getCurrentLocation" class="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-green-700 px-6 py-3 rounded-xl border border-green-200 hover:bg-green-50 transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"></path>
              <path d="M2 12h20"></path>
            </svg>
            Use My Location
          </button>
          <a :href="directionsUrl" target="_blank" class="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Get Directions
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

const searchQuery = ref('');
const mapUrl = ref('https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Eco-Mist+Headquarters&zoom=15');
const directionsUrl = ref('https://www.google.com/maps/dir/?api=1&destination=Eco-Mist+Headquarters');
const isSearching = ref(false);
const isMapLoading = ref(true);
const searchError = ref('');
const suggestions = ref([]);

const getSuggestions = (query) => {
  if (!query || query.length < 3) {
    suggestions.value = [];
    return;
  }
  const samplePlaces = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ'
  ];
  suggestions.value = samplePlaces.filter(place => place.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
};

watch(searchQuery, (newQuery) => {
  getSuggestions(newQuery);
});

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion;
  suggestions.value = [];
  searchPlace();
};

const searchPlace = () => {
  if (!searchQuery.value.trim()) {
    searchError.value = 'Please enter a location to search';
    return;
  }
  isSearching.value = true;
  searchError.value = '';
  isMapLoading.value = true;
  const query = encodeURIComponent(searchQuery.value.trim());
  mapUrl.value = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}&zoom=15`;
  directionsUrl.value = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  suggestions.value = [];
  isSearching.value = false;
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    searchError.value = 'Geolocation is not supported by your browser';
    return;
  }
  isSearching.value = true;
  searchError.value = '';
  isMapLoading.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      mapUrl.value = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${latitude},${longitude}&zoom=15`;
      directionsUrl.value = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      searchQuery.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      isSearching.value = false;
    },
    (error) => {
      console.error('Error getting location:', error);
      searchError.value = 'Unable to get your location. Please enable location services.';
      isSearching.value = false;
      isMapLoading.value = false;
    }
  );
};

const handleMapLoad = () => {
  isMapLoading.value = false;
};
</script>
