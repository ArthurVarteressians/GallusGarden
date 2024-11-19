<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <h1 class="text-xl font-bold">Dynamic Gallery</h1>
    </header>

    <!-- Main Section -->
    <section class="flex-grow w-2/4 h-[80vh] mx-auto pt-4 px-4 bg-gray-100 rounded-lg overflow-y-auto">
      <!-- Row 1: 4 Images -->
      <div class="grid grid-cols-4 gap-4">
        <div v-for="(image, index) in galleryImages.slice(0, 4)" :key="index" class="rounded-lg overflow-hidden">
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-60 object-cover"
            @error="onImageError($event)"
          />
        </div>
      </div>

      <!-- Row 2: 3 Images -->
      <div class="grid grid-cols-3 gap-4 mt-6">
        <div v-for="(image, index) in galleryImages.slice(4, 7)" :key="index" class="rounded-lg overflow-hidden">
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-60 object-cover"
            @error="onImageError($event)"
          />
        </div>
      </div>

      <!-- Row 3: 4 Images -->
      <div class="grid grid-cols-4 gap-4 mt-6">
        <div v-for="(image, index) in galleryImages.slice(10, 14)" :key="index" class="rounded-lg overflow-hidden">
          <img
            :src="image.url"
            :alt="image.description"
            class="w-full h-60 object-cover"
            @error="onImageError($event)"
          />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
      <p class="text-sm">Dynamic Gallery Footer</p>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const galleryImages = ref([]);

    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/images", {
          params: { page: 1 }, // Adjust pagination as needed
        });
        galleryImages.value = response.data.images;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const onImageError = (event) => {
      event.target.src =
        "https://via.placeholder.com/150x150?text=Image+Not+Found"; // Fallback for broken images
    };

    onMounted(() => {
      fetchImages();
    });

    return {
      galleryImages,
      onImageError,
    };
  },
};
</script>

<style scoped>
/* Enforce consistent image size and spacing */
.gallery img {
  width: 100%;
  height: 15rem; /* Fix the height to 15rem (240px) */
  object-fit: cover; /* Maintain aspect ratio and crop excess */
  border-radius: 0.5rem; /* Rounded corners */
}

section {
  background-color: #f9fafb; /* Subtle background for contrast */
}
</style>
