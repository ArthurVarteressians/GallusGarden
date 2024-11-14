<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Header Section -->
    <header
      class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center"
    >
      <h1 class="text-xl font-bold">Gallery Header</h1>
    </header>

    <!-- Main Gallery Section with Custom Layout -->
    <main class="w-[80vw] h-[80vh] overflow-y-auto p-4">
      <div class="space-y-4">
        <!-- Dynamically generate rows with different layouts based on index -->
        <div
          v-for="(row, index) in generateRows()"
          :key="index"
          :class="getRowClass(index)"
        >
          <div
            v-for="image in row"
            :key="image.publicId"
            :class="getImageClass(index, row.indexOf(image))"
          >
            <img
              :src="image.url"
              :alt="image.description"
              class="w-[100vw] h-[20vh] rounded-lg object-container"
            />
          </div>
        </div>
      </div>
      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center py-4">Loading...</div>
    </main>

    <!-- Footer Section -->
    <footer
      class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center"
    >
      <p class="text-sm">Gallery Footer</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

// Define the structure of image data
interface ImageData {
  publicId: string;
  url: string;
  description: string;
}

export default defineComponent({
  name: "CustomGallery",
  setup() {
    const images = ref<ImageData[]>([]);
    const loading = ref(false);
    const page = ref(1);

    // Function to load images from the backend API
    const loadImages = async () => {
      loading.value = true;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/images?page=${page.value}`
        );
        images.value = [...images.value, ...response.data];
        page.value++;
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        loading.value = false;
      }
    };

    // Helper function to split images into rows of 4 or 3 based on layout needs
    const generateRows = () => {
      const rows = [];
      let i = 0;
      while (i < images.value.length) {
        if ((rows.length + 1) % 2 !== 0) {
          rows.push(images.value.slice(i, i + 4)); // Odd rows: 4 images
          i += 4;
        } else {
          rows.push(images.value.slice(i, i + 3)); // Even rows: 3 images
          i += 3;
        }
      }
      return rows;
    };

    // Function to get the CSS class for each row based on the row index
    const getRowClass = (index: number) => {
      return index % 2 === 0
        ? "grid grid-cols-4 gap-4"
        : "grid grid-cols-4 gap-4"; // Both rows use a grid layout
    };

    // Function to get the CSS class for images within the row
    const getImageClass = (rowIndex: number, colIndex: number) => {
      // Odd rows (4 images, each 25%)
      if (rowIndex % 2 === 0) {
        return "col-span-1"; // All images in odd rows take 1 column (25%)
      }
      // Even rows (1 image 50%, 2 images 25%)
      if (colIndex === 0) {
        return "col-span-2"; // First image in even rows takes 2 columns (50%)
      } else {
        return "col-span-1"; // Remaining images in even rows take 1 column (25%)
      }
    };

    onMounted(() => {
      loadImages(); // Initial load
    });

    return {
      images,
      loading,
      generateRows,
      getRowClass,
      getImageClass,
    };
  },
});
</script>

<style scoped></style>
