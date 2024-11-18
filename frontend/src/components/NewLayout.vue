<template>
  <section>
    <div class="mainDiv">
      <Masonry :images="images" />
      <div
        ref="loadMoreTrigger"
        v-if="!allDataLoaded"
        class="loading-indicator"
      >
        Loading more images...
      </div>
      <div v-if="allDataLoaded" class="end-indicator">
        No more images to load
      </div>
    </div>
  </section>
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
    const allDataLoaded = ref(false); // Flag for fully loaded data
    const page = ref(1); // Page number for API requests
    const loadMoreTrigger = ref(null); // Reference to the load more trigger element

    const loadImages = async () => {
      if (loading.value || allDataLoaded.value) return; // Prevent duplicate requests
      loading.value = true;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/images?page=${page.value}`
        );

        if (response.data.images && response.data.images.length > 0) {
          images.value = [...images.value, ...response.data.images];
          page.value++;
          allDataLoaded.value = !response.data.hasMore; // Stop if no more data
        } else {
          allDataLoaded.value = true; // Stop scrolling if no data
        }
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        loading.value = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading.value && !allDataLoaded.value) {
          loadImages();
        }
      },
      { threshold: 1.0 }
    );

    onMounted(() => {
      loadImages(); // Load initial images
      if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value); // Observe the load more trigger
      }
    });

    return { images, loading, allDataLoaded, loadMoreTrigger };
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
.mainDiv {
  width: 80%;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}

.end-indicator {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #999;
  font-style: italic;
}
</style>
