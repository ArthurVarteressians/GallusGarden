  <template>
    
    <div class="masonry">
      <div
        v-for="(item, index) in images"
        :key="index"
        class="masonry-item"
        :style="getRandomItemStyle()"
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
    methods: {
      getRandomItemStyle() {
        // Randomly assign larger spans
        const colSpan = Math.floor(Math.random() * 2) + 1; // 1 or 2 columns
        const rowSpan = Math.floor(Math.random() * 2) + 2; // 2 or 3 rows

        return {
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
        };
      },
    },
  };
  </script>

  <style scoped>
  .masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-rows: 100px;
    gap: 15px;
    padding: 10px;
    grid-auto-flow: dense;
  }

  .masonry-item {
    overflow: hidden;
    border-radius: 12px;
    background-color: #f0f0f0;
  }

  .masonry-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  </style>
