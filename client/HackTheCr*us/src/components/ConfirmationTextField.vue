<template>
  <h2>
    <slot name="title"></slot>
  </h2>
  <p>
    <slot name="legend"></slot>
  </p>
  <slot name="input"></slot>
</template>
<script>
export default {
  name: "ConfirmationTextField",
  props: ["title", "legend", "input"],
}
</script>
<style scoped lang="scss">
h2{
  font-size: 2.5rem;
  margin:0;
}
p{
  font-size: 1.5rem;
  font-weight: 300;
  margin:0;
}

</style>
