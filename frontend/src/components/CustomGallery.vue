<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Header Section -->
    <header
      class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center"
    >
      <h1 class="text-xl font-bold">Gallery Header</h1>
    </header>

    <!-- Main Gallery Section with Custom Layout -->
    <main class="w-[80vw] h-[80vh] overflow-y-auto p-4" ref="galleryContainer">
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
              class="w-full h-[20vh] rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center py-4">Loading...</div>
      <div v-if="allDataLoaded" class="text-center py-4 text-gray-500">
        No more images to load
      </div>
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
    const allDataLoaded = ref(false);
    const galleryContainer = ref(null);

    const loadImages = async () => {
      if (loading.value || allDataLoaded.value) return;

      loading.value = true;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/images?page=${page.value}`
        );
        if (response.data.images && response.data.images.length > 0) {
          images.value = [...images.value, ...response.data.images];
          page.value++;
          allDataLoaded.value = !response.data.hasMore;
        } else {
          allDataLoaded.value = true;
        }
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        loading.value = false;
      }
    };

    const generateRows = () => {
      const rows = [];
      let i = 0;
      while (i < images.value.length) {
        if ((rows.length + 1) % 4 === 0) {
          rows.push(images.value.slice(i, i + 3)); // Rows divisible by 4: 3 images
          i += 3;
        } else {
          rows.push(images.value.slice(i, i + 4)); // Other rows: 4 images
          i += 4;
        }
      }
      return rows;
    };

    const getRowClass = (index: number) => {
      return index % 4 === 3 ? "grid grid-cols-3 gap-4" : "grid grid-cols-4 gap-4";
    };

    const getImageClass = (rowIndex: number, colIndex: number) => {
      if (rowIndex % 4 === 3) {
        // Special layout for rows divisible by 4
        return colIndex === 0 ? "col-span-2" : "col-span-1";
      }
      return "col-span-1"; // Regular rows
    };

    const handleScroll = () => {
      if (!galleryContainer.value) return;

      const container = galleryContainer.value as HTMLElement;
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 10 &&
        !loading.value &&
        !allDataLoaded.value
      ) {
        loadImages();
      }
    };

    onMounted(() => {
      loadImages();
      galleryContainer.value?.addEventListener("scroll", handleScroll);
    });

    return {
      images,
      loading,
      allDataLoaded,
      generateRows,
      getRowClass,
      getImageClass,
      galleryContainer,
    };
  },
});
</script>

<style scoped>
/* Custom Styling */
main {
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
