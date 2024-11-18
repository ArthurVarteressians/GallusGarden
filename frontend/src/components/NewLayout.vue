<template>
  <section> 
  <div class="mainDiv">
    <Masonry :images="images" />
    <div ref="loadMoreTrigger" class="loading-indicator">
      Loading more images...
    </div>
  </div></section>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Masonry from "./Masonry.vue";

export default {
  components: { Masonry },
  setup() {
    const images = ref([]); // Store loaded images
    const loading = ref(false); // Loading state
    const page = ref(1); // Page number for API requests
    const loadMoreTrigger = ref(null); // Reference to the load more trigger element

    // Fetch images from the backend
    const loadImages = async () => {
      if (loading.value) return; // Prevent duplicate requests
      loading.value = true;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/images?page=${page.value}`
        );
        if (Array.isArray(response.data)) {
          images.value = [...images.value, ...response.data];
          page.value++;
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        loading.value = false;
      }
    };

    // Infinite scroll observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading.value) {
          loadImages();
        }
      },
      { threshold: 1.0 }
    );

    // Initial setup
    onMounted(() => {
      loadImages(); // Load initial images
      if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value); // Observe the load more trigger
      }
    });

    return { images, loadMoreTrigger };
  },
};
</script>

<style scoped>
section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainDiv{
  width: 80%;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}
</style>
