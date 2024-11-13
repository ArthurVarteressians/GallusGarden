<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Header Section -->
    <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <h1 class="text-xl font-bold">Gallery Header</h1>
    </header>

    <!-- Main Gallery Section with Column-based Masonry Layout -->
    <main ref="gallery" class="w-[80vw] h-[80vh] overflow-y-auto p-4" @scroll="handleScroll">
      <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        <!-- Dynamically render images from JSON data -->
        <div v-for="image in images" :key="image.publicId" class="mb-4 break-inside-avoid">
          <img class="w-full h-auto rounded-lg object-cover" :src="image.url" :alt="image.description" />
        </div>
      </div>
      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center py-4">
        Loading...
      </div>
    </main>

    <!-- Footer Section -->
    <footer class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <p class="text-sm">Gallery Footer</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

// Define the structure of image data
interface ImageData {
  publicId: string;
  url: string;
  description: string;
}

export default defineComponent({
  name: 'Gallery',
  setup() {
    const images = ref<ImageData[]>([]);
    const loading = ref(false);
    const page = ref(1); // Track page for fetching new data

    // Function to load images from the backend API
    const loadImages = async () => {
      loading.value = true;
      try {
        // Fetch the data from the backend API with pagination
        const response = await axios.get(`http://localhost:5001/api/images?page=${page.value}`);
        images.value = [...images.value, ...response.data]; // Append new data to existing images
        page.value++; // Increment page for the next load
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        loading.value = false;
      }
    };

    // Scroll handler to check if we reached the bottom
    const handleScroll = () => {
      const gallery = document.querySelector("main");
      if (gallery && gallery.scrollTop + gallery.clientHeight >= gallery.scrollHeight - 10) {
        if (!loading.value) {
          loadImages(); // Load more images if not currently loading
        }
      }
    };

    onMounted(() => {
      loadImages(); // Initial load
    });

    return {
      images,
      loading,
      handleScroll,
    };
  },
});
</script>

<style scoped>
/* Custom style for column-based masonry layout */
.break-inside-avoid {
  break-inside: avoid; /* Prevents images from breaking between columns */
}

.columns-1 > div,
.columns-2 > div,
.columns-3 > div,
.columns-4 > div {
  margin-bottom: 1rem; /* Space between images */
}
</style>
