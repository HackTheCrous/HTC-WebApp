<template>
  <svg :width="size" :height="size" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M16.85 2.9C17.1 3.15 17.225 3.446 17.225 3.788C17.225 4.13 17.1 4.42567 16.85 4.675L9.52498 12L16.875 19.35C17.1083 19.5833 17.225 19.875 17.225 20.225C17.225 20.575 17.1 20.875 16.85 21.125C16.6 21.375 16.304 21.5 15.962 21.5C15.62 21.5 15.3243 21.375 15.075 21.125L6.67498 12.7C6.57498 12.6 6.50398 12.4917 6.46198 12.375C6.41998 12.2583 6.39931 12.1333 6.39998 12C6.39998 11.8667 6.42098 11.7417 6.46298 11.625C6.50498 11.5083 6.57564 11.4 6.67498 11.3L15.1 2.875C15.3333 2.64167 15.621 2.525 15.963 2.525C16.305 2.525 16.6006 2.65 16.85 2.9Z"
        :fill="color" :fill-opacity="opacity"/>
  </svg>
</template>
<script>
export default {
  name: 'squeeze',
  props: {
    color: String,
    opacity: String,
      size: String
  }
}
</script>
<style scoped lang="scss">
@import "@/styles/icons.scss";
</style>