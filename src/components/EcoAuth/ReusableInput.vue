<template>
  <div class="relative">
    <label :for="id" class="sr-only">{{ placeholder }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="{ 'border-red-500': error }"
      class="w-full bg-white border border-green-200 rounded-lg px-4 py-3 text-gray-800 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      :aria-describedby="ariaDescribedby"
    />
    <p v-if="error" :id="ariaDescribedby" class="text-red-500 text-sm mt-1">{{ error }}</p>
    <button
      v-if="showToggle"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
      @click="$emit('toggle')"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  type: { type: String, default: "text" },
  modelValue: String,
  error: String,
  placeholder: String,
  ariaDescribedby: String,
  showToggle: { type: Boolean, default: false },
});
defineEmits(["update:modelValue", "toggle"]);
</script>

<style>
/* Add any specific styles for the reusable input here */
</style>
