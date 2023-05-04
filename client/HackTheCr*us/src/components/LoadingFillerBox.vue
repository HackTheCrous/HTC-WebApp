<template>
  <div class="loading-box" :style="{
      'width': this.width, 'height' : this.height
  }"><h2><slot></slot></h2></div>
</template>

<script>
export default {
    name: "LoadingFillerBox",
    props: {
        width: String,
        height: String
    }
}
</script>

<style scoped lang="scss">
  @keyframes loading {
      0%{
          background-position: 0 50%;
      }
      50%{
          background-position: 100% 50%;
      }

      100%{
          background-position: 0 50%;
      }
  }

 .loading-box{
     //background: linear-gradient(90deg, rgba(220, 220, 220, 0.5) 0%, rgba(140, 140, 140, 0.8) 50%, rgba(220, 220, 220, 0.5) 100%);
    background: rgba(110, 241, 163, 0.2);

     background-size: 400% 400%;


     border-radius:10px;

     animation: loading 1.4s ease infinite;
     display: flex;
     align-items: center;
     justify-content: center;

     h2{
         color: var(--color-background);
       font-weight: 400;
     }

 }
</style>