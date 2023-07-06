<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
  <div class="confirmation-code">
    <form method="GET">
      <div id="confirmation-code-container">
        <input
          type="text"
          v-model="value"
          maxlength="6"
          @input="setSelectionPosition"
          @keyup="setSelectionPosition"
          @click="setSelectionPosition"
          ref="input"
        />
        <div id="placeholder-container">
          <span
            v-for="index in 6"
            :key="index"
            :class="isFocused(index) ? 'focused' : ''"
            @click="setCarretPosition(index)"
            >{{ codeCharAt(index - 1) }}
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ConfirmationCode",
  emits: ["input"],
  data() {
    return {
      value: "",
      cursor: 0,
    };
  },
  methods: {
    codeCharAt(rank) {
      if (rank < this.value.length) {
        return this.value.charAt(rank);
      }
      return " ";
    },
    setSelectionPosition(event) {
      this.cursor = this.$refs.input.selectionStart;
    },
    setCarretPosition(rank) {
      this.$refs.input.focus();
      this.$refs.input.selectionStart = this.$refs.input.selectionEnd = rank;
      this.setSelectionPosition();
    },
  },
  computed: {
    isFocused() {
      return (rank) => {
        return rank === this.cursor;
      };
    },
  },
  watch: {
    value(newValue, oldValue) {
      const numbers = "0123456789";
      if (
        newValue.length > oldValue.length &&
        !numbers.includes(newValue.charAt(newValue.length - 1))
      ) {
        this.value = oldValue;
      }
      this.$emit("input", this.value);
    },
  },
};
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style scoped lang="scss">
.confirmation-code{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
form {
  #confirmation-code-container {
    position: relative;
    width: 400px;
    margin-top: 30px;
    margin-bottom: 30px;
    input {
      position: relative;
      z-index: 1;
      font-size: 50px;
      width: 100%;
      background: transparent;
      opacity: 0;
    }
    #placeholder-container {
      opacity: 1;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      width: 100%;
      display: flex;
      flex-direction: row;
      height: 100%;
      span {
        color: var(--color-text);
        border: 1px solid var(--color-border);
        font-family: VT323, monospace;
        flex: 1;
        font-size: 40px;
        background: var(--color-background-soft);
        border-radius: 5px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 3px;
        margin-right: 3px;
        &.focused {
          color: black;
          background: #abddc0d6;
          border: 3px solid var(--primary-color);
        }
      }
    }
  }
}
</style>
