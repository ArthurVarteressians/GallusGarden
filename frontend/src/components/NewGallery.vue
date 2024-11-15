<template>
  <div class="h-screen flex flex-col items-center">
    <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <h1 class="text-xl font-bold">Gallery Header</h1>
    </header>

    <main ref="gallery" class="w-[80vw] h-[80vh] overflow-y-auto p-4" @scroll="handleScroll">
      <div class="masonry-grid">
        <div 
          v-for="(image, index) in shuffledImages" 
          :key="index" 
          class="masonry-item"
          :style="getGridStyles(index)"
        >
          <img 
            :src="image.url" 
            :alt="image.description" 
            class="w-full object-fit-cover"
          />
          <div class="p-2">
            <p class="text-sm font-semibold">{{ image.description }}</p>
          </div>
        </div>
      </div>
      <div v-if="loading" class="text-center py-4">
        Loading...
      </div>
    </main>

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
  name: 'NewGallery',
  setup() {
    const images = ref<ImageData[]>([]);
    const shuffledImages = ref<ImageData[]>([]);
    const loading = ref(false);
    const page = ref(1);

    // Function to load images from the backend API
    const loadImages = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`http://localhost:5001/api/images?page=${page.value}`);
        
        // Append images directly if data is an array
        if (Array.isArray(response.data)) {
          images.value = [...images.value, ...response.data];
          page.value++;
          shuffleImages();
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        loading.value = false;
      }
    };

    // Function to shuffle images
    const shuffleImages = () => {
      shuffledImages.value = [...images.value].sort(() => Math.random() - 0.5);
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

    // Helper function to assign dynamic grid styles for masonry effect
    const getGridStyles = (index: number) => {
      // Define different row and column spans for variety
      const rowSpanOptions = ['span 1', 'span 2', 'span 3'];
      const columnSpanOptions = ['span 1', 'span 2'];

      // Cycle through different row and column spans based on index
      const rowSpan = rowSpanOptions[index % rowSpanOptions.length];
      const columnSpan = columnSpanOptions[index % columnSpanOptions.length];

      return {
        gridRowEnd: rowSpan,
        gridColumnEnd: columnSpan,
        // Adjust min-height based on your desired image display
        minHeight: 'auto', // Replace with your desired minimum height
      };
    };

    onMounted(() => {
      loadImages();
    });

    return {
      shuffledImages,
      loading,
      handleScroll,
      getGridStyles,
    };
  },
});
</script>

<style scoped>
/* CSS Grid masonry layout */
.masonry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 10px;
  grid-auto-flow: dense; /* Fill gaps for a denser look */
  gap: 16px;
}

.masonry-item {
  overflow: hidden;
  border-radius: 0.5rem;
}
</style>