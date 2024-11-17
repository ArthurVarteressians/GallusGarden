<template>
     <div>
       <Masonry :images="images" />
       <div ref="loadMoreTrigger" v-if="loading" class="loading-indicator">
         Loading more images...
       </div>
     </div>
   </template>
   
   <script>
   import { ref, onMounted } from "vue";
   import axios from "axios";
   import Masonry from "./Masonry.vue";
   
   export default {
     components: { Masonry },
     setup() {
       const images = ref([]);
       const loading = ref(false);
       const page = ref(1);
       const loadMoreTrigger = ref(null);
   
       const loadImages = async () => {
         loading.value = true;
         try {
           const response = await axios.get(`http://localhost:5001/api/images?page=${page.value}`);
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
   body {
     margin: 0;
     font-family: Arial, sans-serif;
   }
   .loading-indicator {
     text-align: center;
     padding: 20px;
     font-size: 18px;
   }
   </style>
   