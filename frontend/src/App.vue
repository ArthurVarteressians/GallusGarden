<script lang="ts">
import { defineComponent } from "vue";
import Gallery from "./components/Gallery.vue";
import CustomGallery from "./components/CustomGallery.vue";
import AwesomeGallery from "./components/AwesomeGallery.vue";
import NewLayout from "./components/NewLayout.vue";
import LastVersion from "./components/LastVersion.vue"
export default defineComponent({
  components: {
    CustomGallery,
    AwesomeGallery,
    Gallery,
    LastVersion,
    NewLayout
  },
});
</script>

<template>
  <div>
    <LastVersion />        
  </div>
</template>
