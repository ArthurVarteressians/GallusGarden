<template>
     <div class="h-screen flex flex-col items-center">
       <!-- Header Section -->
       <header class="w-full h-[10vh] bg-gray-800 text-white flex items-center justify-center">
         <h1 class="text-xl font-bold">Awesome Gallery</h1>
       </header>
   
       <!-- Main Gallery Section with Responsive Masonry Layout -->
       <main class="w-[90vw] md:w-[80vw] lg:w-[60vw] h-[80vh] overflow-y-auto m-4 p-4" @scroll="handleScroll">
         <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
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
         <div v-if="allDataLoaded" class="text-center py-4 text-gray-500">No more images to load</div>
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
       const allDataLoaded = ref(false); // New flag to track if all data is loaded
       const page = ref(1);
   
       const loadImages = async () => {
         if (loading.value || allDataLoaded.value) {
           console.log("Loading stopped: either loading is in progress or all data is loaded.");
           return; // Prevent loading if already loading or all data is loaded
         }
   
         loading.value = true;
         try {
           const response = await axios.get(
             `http://localhost:5001/api/images?page=${page.value}`
           );
           const newImages = response.data;
   
           // Only append new images if there are any
           if (newImages.length > 0) {
             images.value = [...images.value, ...newImages];
             page.value++; // Increment the page only if new data is available
             console.log(`Loaded page ${page.value - 1} with ${newImages.length} images`);
           } else {
             // If no new data is available, set allDataLoaded to true to stop further loading
             allDataLoaded.value = true;
             console.log("No more images to load; allDataLoaded set to true.");
           }
         } catch (error) {
           console.error("Error loading images:", error);
         } finally {
           loading.value = false;
         }
       };
   
       const getImageSizeClass = (image: ImageData) => {
         if (image.orientation === "horizontal") {
           return "col-span-2 row-span-1"; // Wide display for horizontal images
         } else if (image.orientation === "vertical") {
           return "col-span-1 row-span-2"; // Tall display for vertical images
         } else {
           return "col-span-1 row-span-1"; // Standard display for square images
         }
       };
   
       const handleScroll = (event: Event) => {
         const target = event.target as HTMLElement;
         if (
           target.scrollTop + target.clientHeight >= target.scrollHeight - 10 &&
           !loading.value &&
           !allDataLoaded.value // Check if all data is loaded to stop further scroll-based loading
         ) {
           console.log("Scroll triggered loading more images");
           loadImages();
         } else if (allDataLoaded.value) {
           console.log("All data has been loaded; no further scroll loading.");
         }
       };
   
       onMounted(() => {
         loadImages(); // Initial load
       });
   
       return {
         images,
         loading,
         allDataLoaded, // Make this available in the template
         handleScroll,
         getImageSizeClass,
       };
     },
   });
   </script>
   
   <style scoped>
   /* Optional CSS for additional styling */
   </style>
   