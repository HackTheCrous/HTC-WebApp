<script>
export default {
  data() {
    return {}
  },
  props: {
    focused: String,
    name: String,
  },
  name: "TagPlace",
  methods: {
    handleClick() {
      const data = this.name
      this.$emit('child-clicked', data);
    }
  }
}
</script>

<template>
  <div v-if="this.name === this.focused" @click="handleClick" class="tag focus">
    <p>
      {{ this.name }}
    </p>
  </div>
  <div v-else @click="handleClick" class="tag">
    <p>
      {{ this.name }}
    </p>
  </div>
</template>

<style scoped>

.tag {
  font-family: Inter, sans-serif;
  font-weight: 300;
  width: fit-content;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
  position: relative;
  z-index:2;
  border-bottom: solid 1px var(--color-border);
}

.tag.focus {
  color: #53e78a;
  text-align: center;
  border-bottom: solid 1px #53e78a;
}
</style>