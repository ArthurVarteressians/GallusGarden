<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Header Section -->
    <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <h1 class="text-xl font-bold">Gallery Header</h1>
    </header>

    <!-- Main Gallery Section -->
    <main class="w-[70vw] h-[80vh] overflow-y-auto p-4" ref="galleryContainer">
      <div class="grid grid-cols-4 gap-4">
        <!-- Render each image -->
        <div v-for="image in images" :key="image.publicId" class="w-full h-[20vh]">
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-full rounded-lg object-cover"
          />
        </div>
      </div>
      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center py-4">Loading...</div>
      <div v-if="allDataLoaded" class="text-center py-4 text-gray-500">
        No more images to load
      </div>
    </main>

    <!-- Footer Section -->
    <footer class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <p class="text-sm">Gallery Footer</p>
    </footer>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

export default defineComponent({
  name: "Gallery",
  setup() {
    const images = ref([]);
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
          images.value.push(...response.data.images);
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

    const handleScroll = () => {
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
      galleryContainer,
    };
  },
});
</script>


<style scoped>
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

