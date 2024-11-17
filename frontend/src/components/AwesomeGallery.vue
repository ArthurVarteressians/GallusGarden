<template>
  <div class="h-screen flex flex-col items-center">
    <!-- Header Section -->
    <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <h1 class="text-xl font-bold">Awesome Gallery</h1>
    </header>

    <!-- Main Gallery Section -->
    <main class="w-[90vw] lg:w-[80vw] h-[80vh] overflow-y-auto m-4 p-4" @scroll="handleScroll">
      <div class="grid grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px] lg:auto-rows-[250px]">
        <div
          v-for="image in images"
          :key="image.publicId"
          :class="getImageSizeClass(image)"
        >
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
      <div v-if="loading" class="text-center py-4">Loading...</div>
      <div v-if="allDataLoaded" class="text-center py-4 text-gray-500">No more images to load</div>
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

interface ImageData {
  publicId: string;
  url: string;
  description: string;
  orientation: string;
}

export default defineComponent({
  name: "AwesomeGallery",
  setup() {
    const images = ref<ImageData[]>([]);
    const loading = ref(false);
    const allDataLoaded = ref(false);
    const page = ref(1);

    const loadImages = async () => {
      if (loading.value || allDataLoaded.value) return;

      loading.value = true;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/images?page=${page.value}`
        );
        const newImages = response.data;

        if (newImages.length > 0) {
          images.value = [...images.value, ...newImages];
          page.value++;
        } else {
          allDataLoaded.value = true;
        }
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        loading.value = false;
      }
    };

    const getImageSizeClass = (image: ImageData) => {
      if (image.orientation === "horizontal") {
        return "col-span-2 row-span-1";
      } else if (image.orientation === "vertical") {
        return "col-span-1 row-span-2";
      } else {
        return "col-span-1 row-span-1";
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (
        target.scrollTop + target.clientHeight >= target.scrollHeight - 10 &&
        !loading.value &&
        !allDataLoaded.value
      ) {
        loadImages();
      }
    };

    onMounted(() => {
      loadImages();
    });

    return {
      images,
      loading,
      allDataLoaded,
      handleScroll,
      getImageSizeClass,
    };
  },
});
</script>
