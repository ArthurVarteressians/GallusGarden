<template>
     <div class="h-screen flex flex-col items-center">
       <!-- Header Section -->
       <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
         <h1 class="text-xl font-bold">Awesome Gallery</h1>
       </header>
   
       <!-- Main Gallery Section with Masonry Layout -->
       <main class="w-[60vw] h-[80vh] overflow-y-auto m-4 p-4" @scroll="handleScroll">
         <div class="grid grid-cols-4 gap-4 auto-rows-auto">
           <div
             v-for="image in images"
             :key="image.publicId"
             :class="[getImageSizeClass(image)]"
           >
             <img
               :src="image.url"
               :alt="image.description"
               class="rounded-lg w-full h-full object-center max-h-[175px]"
             />
           </div>
         </div>
         <div v-if="loading" class="text-center py-4">Loading...</div>
       </main>
   
       <!-- Footer Section -->
       <footer class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
         <p class="text-sm">Gallery Footer</p>
       </footer>
     </div>
   </template>
   
   <script lang="ts">
   import { defineComponent, ref, onMounted } from "vue";
   import axios from "axios";
   
   interface ImageData {
     publicId: string;
     url: string;
     description: string;
     orientation: string;
   }
   
   export default defineComponent({
     name: "AwesomeGallery",
     setup() {
       const images = ref<ImageData[]>([]);
       const loading = ref(false);
       const page = ref(1);
   
       const loadImages = async () => {
         loading.value = true;
         try {
           const response = await axios.get(
             `http://localhost:5001/api/images?page=${page.value}`
           );
           images.value = [...images.value, ...response.data];
           page.value++;
         } catch (error) {
           console.error("Error loading images:", error);
         } finally {
           loading.value = false;
         }
       };
   
       const getImageSizeClass = (image: ImageData) => {
         if (image.orientation === "horizontal") {
           return "col-span-2 row-span-1";
         } else if (image.orientation === "vertical") {
           return "col-span-1 row-span-2";
         } else {
           return "col-span-1 row-span-1";
         }
       };
   
       const handleScroll = (event: Event) => {
         const target = event.target as HTMLElement;
         if (
           target.scrollTop + target.clientHeight >= target.scrollHeight - 10 &&
           !loading.value
         ) {
           loadImages();
         }
       };
   
       onMounted(() => {
         loadImages();
       });
   
       return {
         images,
         loading,
         handleScroll,
         getImageSizeClass,
       };
     },
   });
   </script>
   