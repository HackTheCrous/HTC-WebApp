<template>
  <div class="search-suggestions">
    <p v-for="elt in data" :class="focus===elt ? 'focused' : ''" @click="focusOn">{{ elt }}</p>
  </div>
</template>

<script>
export default {
  name: "SearchSuggestions",
  props: {
    data: {
      type: Array,
      default: []
    },
    focus: {
      type: String
    }
  },
  emits: ['onfocus'],
  methods: {
    focusOn(e){
      this.$emit('onfocus', e.target.innerText);
    }
  }
}
</script>

<style scoped lang="scss">
.search-suggestions{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  @media screen and (max-width: 1000px) {
    justify-content: space-between;
  }
  p{
    padding: 2px 20px;
    font-size: 14px;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    border-radius: 100px;
    margin-right:20px;
    @media screen and (max-width:1000px){
      margin-right:0px;
    }
    margin-bottom: 10px;
    transition: 0.1s ease-in-out;
    &:hover{
      background: var(--color-primary);
      color: var(--color-background);
      transition: 0.1s ease-in-out;
    }
    &.focused{
      background: var(--color-primary);
      color: var(--color-background);
      transition: 0.1s ease-in-out;
    }
  }
}
</style>