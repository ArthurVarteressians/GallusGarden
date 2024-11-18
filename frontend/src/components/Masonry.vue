<template>
  <div class="masonry">
    <div
      v-for="(item, index) in images"
      :key="index"
      class="masonry-item"
      :style="getItemStyle(index)"
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
    getItemStyle(index) {
      // Dynamically assign grid spans based on index
      const spans = [
        { col: 2, row: 2 },
        { col: 1, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 1, row: 1 },
        { col: 3, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 1, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 2, row: 1 },
      ];
      const span = spans[index % spans.length];
      return {
        gridColumn: `span ${span.col}`,
        gridRow: `span ${span.row}`,
      };
    },
  },
};
</script>

<style scoped>
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 150px; /* Base height for rows */
  gap: 10px;
  padding: 10px;
  grid-auto-flow: dense; /* Fill gaps dynamically */
}

.masonry-item {
  overflow: hidden;
  border-radius: 8px;
  background-color: #f0f0f0; /* Fallback for empty space */
}

.masonry-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
