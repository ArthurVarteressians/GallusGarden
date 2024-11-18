<script lang="ts">
import { defineComponent } from "vue";
import Gallery from "./components/Gallery.vue";
import CustomGallery from "./components/CustomGallery.vue";
import AwesomeGallery from "./components/AwesomeGallery.vue";
import NewLayout from "./components/NewLayout.vue";
export default defineComponent({
  components: {
    CustomGallery,
    AwesomeGallery,
    Gallery,
    NewLayout
  },
});
</script>

<template>
  <div>
    <NewLayout />        
  </div>
</template>
