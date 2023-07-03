<template>
  <form :id="step">
    <slot></slot>
    <span>
      <button v-if="!valid" class="disable" @click="cancel">Valider</button>
      <button v-else-if="step != max" class="next" @click="next">Valider</button>
      <button v-else class="next"  @click="next">Terminer</button>
      <button v-if="step != 1" class="skip" @click="previous">Revenir</button>
    </span>
  </form>
</template>
<script>
export default {
  name: "ConfirmationQuestion",
  props: ["step", "current", "max", "value", "regex"],
  emits: ["next", "previous"],
  methods: {
    cancel(e) {
      e.preventDefault();
    },
    next(e) {
      e.preventDefault();
      this.$emit("next");
    },
    previous(e) {
      e.preventDefault();
      this.$emit("previous");
    },
  },
  computed: {
    valid() {
      if (this.regex) {
        return this.regex.test(this.value);
      } else {
        return true;
      }
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
      &.disable{
        opacity: 0.6;
        transition: opacity 0.1s ease-in-out;
        &:hover{
          opacity: 0.6;
          transition: opacity 0.1s ease-in-out;
        }
        &:active{
          background: var(--color-warning);
          color: var(--color-background);
          border: 1px solid var(--color-warning);
        }
      }
    }

  }
}
</style>
