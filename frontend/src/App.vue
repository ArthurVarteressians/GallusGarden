<script lang="ts">
import { defineComponent } from "vue";
import Gallery from "./components/Gallery.vue";
import CustomGallery from "./components/CustomGallery.vue";
export default defineComponent({
  components: {
    CustomGallery,
    Gallery,
  },
});
</script>

<template>
  <div>
    <CustomGallery />
  </div>
</template>
