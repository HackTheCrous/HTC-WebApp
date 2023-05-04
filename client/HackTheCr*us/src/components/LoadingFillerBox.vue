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
     background: linear-gradient(90deg, hsla(145, 82%, 73%, 0.2) 0%, hsla(150, 61%, 48%, 0.6) 50%, hsla(145, 84%, 73%, 0.2) 100%);


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