<template>
  <section>
    <div class="mainDiv">
      <Masonry :images="images" />
      <div ref="loadMoreTrigger" v-if="loading" class="loading-indicator">
        Loading more images...
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
    const images = ref([]); // Array to hold images
    const loading = ref(false);
    const page = ref(1);
    const loadMoreTrigger = ref(null);

    const loadImages = async () => {
      if (loading.value) return; // Prevent duplicate requests

      loading.value = true;
      try {
        const response = await axios.get(
          `http://localhost:5001/api/images?page=${page.value}`
        );
        if (Array.isArray(response.data)) {
          images.value = [...images.value, ...response.data];
          page.value++; // Increment page for next fetch
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        loading.value = false;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading.value) {
          loadImages();
        }
      },
      { threshold: 1.0 }
    );

    onMounted(() => {
      loadImages();
      if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
      }
    });

    return { images, loading, loadMoreTrigger };
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
}
</style>
