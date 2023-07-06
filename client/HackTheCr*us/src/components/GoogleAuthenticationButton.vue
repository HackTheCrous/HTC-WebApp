<template>
  <button @click="handleClick" class="google-button">
    <google size="22"></google>
    <p>
      <slot></slot>
    </p>
  </button>
</template>
<script>
import google from "@/assets/google.vue";
import { endpoint } from "@/main";

export default {
  name: "GoogleAuthenticationButton",
  components: {
    google,
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      this.googleAuthentication();
    },
    async googleAuthentication() {
      window.location.href = `${endpoint}/login/google?origin=${window.location.origin}/login`;
    },
  },
};
</script>
<style scoped lang="scss">
button.google-button {
  width: 100%;
  display: flex;
  flex-direction: row !important;
  color: var(--color-text) !important;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  p {
    margin-left: 15px;
    line-height: 1;
  }
  border: 1px solid var(--color-text) !important;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: var(--color-text) !important;
    color: var(--color-background) !important;
  }
}
</style>
