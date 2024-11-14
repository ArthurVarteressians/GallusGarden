<script lang="ts">
import { defineComponent } from "vue";
import Gallery from "./components/Gallery.vue";
import CustomGallery from "./components/CustomGallery.vue";
import AwesomeGallery from "./components/AwesomeGallery.vue";
AwesomeGallery
export default defineComponent({
  components: {
    CustomGallery,
    AwesomeGallery,
    Gallery,
  },
});
</script>

<template>
  <div>
    <AwesomeGallery />
  </div>
</template>
