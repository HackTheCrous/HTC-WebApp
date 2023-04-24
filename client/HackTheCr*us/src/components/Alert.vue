<template>

  <div id="alert" v-if="type === 'Success'" class="success">
    {{ msg }}
  </div>
    <div id="alert" v-else class="error">
        <p>{{ msg }}</p>
    </div>
</template>

<script>
export default {
  props: ['msg', 'type'],
  name: "Alert"
}
</script>

<style scoped lang="scss">
#alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  z-index: 100;
  p{
    width:100%;
    text-align: center;
    font-family: Inter, sans-serif;
    font-size: 20px;
  }
}
.error{
  background-color: #e63737;
}
.success{
  background-color: #63F49E;
}
</style>