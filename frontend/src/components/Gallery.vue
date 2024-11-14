<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Header Section -->
    <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <h1 class="text-xl font-bold">Gallery Header</h1>
    </header>

    <!-- Main Gallery Section with Column-based Masonry Layout -->
    <main ref="gallery" class="w-[80vw] h-[80vh] overflow-y-auto p-4" @scroll="handleScroll">
      <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        <!-- Dynamically render images with orientation check -->
        <div 
          v-for="image in images" 
          :key="image.publicId" 
          class="mb-4 break-inside-avoid"
          :class="getImageClass(image)"
        >
          <img 
            :src="image.url" 
            :alt="image.description" 
            class="w-full h-auto rounded-lg object-cover" 
          />
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
    const page = ref(1);

    // Function to load images from the backend API
    const loadImages = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`http://localhost:5001/api/images?page=${page.value}`);
        images.value = [...images.value, ...response.data];
        page.value++;
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
          loadImages();
        }
      }
    };

    // Function to determine image orientation class
    const getImageClass = (image: ImageData) => {
      // Create a new image element to check dimensions
      const img = new Image();
      img.src = image.url;
      if (img.width > img.height) {
        return 'horizontal-image'; // Custom class for horizontal images
      } else {
        return 'vertical-image'; // Custom class for vertical images
      }
    };

    onMounted(() => {
      loadImages();
    });

    return {
      images,
      loading,
      handleScroll,
      getImageClass,
    };
  },
});
</script>

<style scoped>
/* Styles for image orientations */
.horizontal-image img {
  width: 100%; /* Full width for horizontal images */
  height: auto;
  aspect-ratio: 16 / 9; /* Aspect ratio to maintain width and height for horizontal images */
}

.vertical-image img {
  width: 100%; /* Full width for vertical images */
  height: auto;
  aspect-ratio: 9 / 16; /* Aspect ratio for vertical images */
}

/* Custom style for column-based masonry layout */
.break-inside-avoid {
  break-inside: avoid;
}

.columns-1 > div,
.columns-2 > div,
.columns-3 > div,
.columns-4 > div {
  margin-bottom: 1rem;
}
</style>
