<template>
  <div id="alert" v-if="type === 'Error'" class="error">
    {{ msg }}
  </div>
  <div id="alert" v-if="type === 'Success'" class="success">
    {{ msg }}
  </div>
</template>

<script>
export default {
  props: ['msg', 'type'],
  name: "Alert"
}
</script>

<style scoped>
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
}
.error{
  background-color: #e63737;
}
.success{
  background-color: #63F49E;
}
</style>