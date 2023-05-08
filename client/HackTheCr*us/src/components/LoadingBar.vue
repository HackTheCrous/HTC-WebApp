<template>
  <div class="loading-bar">
    <div class="bar" ref="loading"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingBar",
  mounted() {
    console.log(this.$refs);
    this.interval = setInterval(() => {
      this.$refs.loading.style.width = this.width + Math.round(Math.random()*10)+1 + "%";
    }, Math.round(Math.random()*1000) + 100);
  },
  beforeUnmount() {
    this.$refs.loading.style.width = "100%";
    console.log('cleared');
    clearInterval(this.interval);
  },
  data(){
    return {
      width: 0,
      interval: null
    }
  }
}

</script>

<style scoped lang="scss">

.loading-bar{
  position: absolute;
  top: 0;
  left:0;
  width:100%;
  height: 5px;
  z-index:5000;
  .bar{
    width:0%;
    height: 100%;
    background: var(--color-primary);
    transition: 0.01s ease-in-out;
  }
}
</style>