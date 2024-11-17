<template>
     <div class="masonry">
       <div
         v-for="(item, index) in images"
         :key="index"
         :class="`masonry-item masonry-item-${(index % 12) + 1}`"
       >
         <img :src="item.url" :alt="item.description" class="masonry-image" />
       </div>
     </div>
   </template>
   
   <script>
   export default {
     name: "Masonry",
     props: {
       images: {
         type: Array,
         required: true,
       },
     },
   };
   </script>
   
   <style scoped>
   .masonry {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
     grid-template-rows: repeat(4, 200px); /* Four rows per load */
     gap: 10px;
     padding: 10px;
   }
   
   .masonry-item img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     border-radius: 8px;
   }
   
   /* Define specific layout pattern for each image position */
   
   .masonry-item-1 {
     grid-column: span 2;
     grid-row: span 2;
   }
   
   .masonry-item-2 {
     grid-column: span 1;
     grid-row: span 1;
   }
   
   .masonry-item-3 {
     grid-column: span 1;
     grid-row: span 2;
   }
   
   .masonry-item-4 {
     grid-column: span 2;
     grid-row: span 1;
   }
   
   .masonry-item-5 {
     grid-column: span 1;
     grid-row: span 1;
   }
   
   .masonry-item-6 {
     grid-column: span 3;
     grid-row: span 2;
   }
   
   .masonry-item-7 {
     grid-column: span 1;
     grid-row: span 1;
   }
   
   .masonry-item-8 {
     grid-column: span 2;
     grid-row: span 1;
   }
   
   .masonry-item-9 {
     grid-column: span 1;
     grid-row: span 2;
   }
   
   .masonry-item-10 {
     grid-column: span 1;
     grid-row: span 1;
   }
   
   .masonry-item-11 {
     grid-column: span 2;
     grid-row: span 1;
   }
   
   .masonry-item-12 {
     grid-column: span 2;
     grid-row: span 1;
   }
   
   /* Add additional classes if necessary to create a consistent pattern */
   </style>
   