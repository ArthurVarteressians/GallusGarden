<script lang="ts">
import { defineComponent } from "vue";
import Gallery from "./components/Gallery.vue";
import CustomGallery from "./components/CustomGallery.vue";
import AwesomeGallery from "./components/AwesomeGallery.vue";
import NewGallery from "./components/NewGallery.vue";

export default defineComponent({
  components: {
    CustomGallery,
    AwesomeGallery,
    NewGallery,
    Gallery,
  },
});
</script>

<template>
  <div>
    <NewGallery />
  </div>
</template>
