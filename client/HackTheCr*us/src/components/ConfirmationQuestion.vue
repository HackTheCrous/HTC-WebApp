<template>
  <form :id="step" v-if="current == step">
    <slot></slot>
    <span>
      <button class="next" @click="next">Valider</button>
      <button class="skip" @click="previous">Revenir</button>
    </span>
  </form>
</template>
<script>
export default {
  name: "ConfirmationQuestion",
  props: ["step", "current"],
  emits: ["next", "previous"],
  methods: {
    next(e) {
      e.preventDefault();
      this.$emit("next");
    },
    previous(e) {
      e.preventDefault();
      this.$emit("previous");
    },
  },
};
</script>
<style scoped lang="scss">
form {
  width: 100%;

  &::before {
    content: attr(id) " → ";
    display: block;
    position: absolute;
    top: 0;
    left: -30px;
  }
  span {
    display: flex;
    justify-content: space-between;
    width: 100%;
    button {
      margin: 0;
      border: none;
      font-weight: bold;
      background: var(--color-heading);
      color: var(--color-background);
      padding: 7px 30px;
      border-radius:5px;
      border: 1px solid var(--color-heading);
      &.next:hover{
        background: var(--color-background);
        color: var(--color-heading);
        transition: background 0.1s ease-in-out;
      } 
      &.skip{
        opacity: 0.6;
        transition: opacity 0.1s ease-in-out;
        &:hover{
          opacity: 1;
          transition: opacity 0.1s ease-in-out;
        }
      }
    }

  }
}
</style>
