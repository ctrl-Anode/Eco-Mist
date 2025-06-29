<template>
  <section id="faq" class="px-4 sm:px-6 py-20 sm:py-24 relative z-10">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div class="w-24 h-1.5 bg-gradient-to-r from-green-600 to-green-400 mx-auto rounded-full"></div>
      </div>

      <div class="max-w-4xl mx-auto space-y-6">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-white/95 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-6 hover:shadow-2xl transition-shadow"
        >
          <h3 class="text-xl font-semibold text-green-800 mb-3">{{ faq.question }}</h3>
          <p class="text-gray-600 text-lg">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const faqs = [
  {
    question: "What is Eco-Mist?",
    answer:
      "Eco-Mist is an IoT-driven aeroponics farming system designed to optimize growth, reduce resource consumption, and provide real-time insights for sustainable agriculture.",
  },
  {
    question: "How does Eco-Mist work?",
    answer:
      "Eco-Mist uses IoT sensors to monitor environmental conditions and automate nutrient delivery and misting cycles for optimal plant growth. The system connects to your wireless network for seamless data transmission and control.",
  },
  {
    question: "Is Eco-Mist suitable for all crops?",
    answer:
      "Eco-Mist is ideal for a wide range of crops, particularly those that thrive in aeroponic systems, such as leafy greens, herbs, and many other high-value crops that benefit from precise environmental control.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide comprehensive support including installation guidance, system training, regular software updates, and technical assistance to ensure your Eco-Mist system operates at peak performance.",
  },
];
</script>
