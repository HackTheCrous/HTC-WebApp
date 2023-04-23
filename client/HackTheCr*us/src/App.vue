<template>
  <main>
    <Alert v-if="this.alertTriggered" :msg="this.alert.msg" :type="this.alert.status"/>
    <div id="nav">
      <router-link to="/">
        <img src="./assets/logoV2.png" alt="logo">
      </router-link>
      <div id="tools">
        <router-link class="icon" to="/login"><account/>Login</router-link>
        <router-link class="icon" to="/register"><account/>Register</router-link>
        <router-link class="icon" to="/"><restaurant/>Restaurants</router-link>
      </div>
      <button class="icon">
        <squeeze/>
      </button>
    </div>
    <div id="content">
      <router-view  @triggerAlert="(msg, type) => { triggerAlert(msg,type) }"/>
    </div>
  </main>
</template>

<script>
import Alert from "./components/Alert.vue";
import squeeze from "./assets/squeeze.vue";
import account from "./assets/account.vue";
import search from "./assets/search.vue";
import restaurant from "./assets/restaurant.vue";

export default {
  name: "App",
  components: {Alert,squeeze,account,search,restaurant},
  data() {
    return {
      alertTriggered: false,
      alert: {
        msg: '',
        status: ''
      }
    }
  },
  methods: {
    triggerAlert(msg, status) {
      this.alertTriggered = true;
      this.alert.msg = msg;
      this.alert.status = status;
      setTimeout(() => {
        this.alertTriggered = false;
      }, 3000)
    }
  }
}
</script>

<style scoped lang="scss">

$widthSideBar: 19%;
$minWidthSideBar: 100px;

main {
  width: 100%;
  padding: 0px;
  margin: 0px;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
}

#nav {
  width: $widthSideBar;
  min-width: $minWidthSideBar;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100dvh;
  position: fixed;
  background: #0C0C0C;

  a {
    padding-left:10%;
    color: rgba(255, 255, 255, 0.75);
    font-family: Inter, sans-serif;
    font-size: 25px;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;

    text-wrap: avoid;

    &.router-link-active {
      color: #63F49E;

    }
    img{
      height:50px;
      width: 55px;
    }
  }
  #tools{
    display: flex;
    flex-direction: column;
    justify-content: center;

  }
  button{
    width:100%;
    background: transparent;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    border: none;
  }

  .icon{

    &.router-link-active{
      border-left: 5px solid #63F49E;
      padding-left:calc(10% - 5px);
    }
  }
}

#content {
  margin-top: 30px;
  width: calc(100% - #{$widthSideBar} - #{$minWidthSideBar} + 20px);
  min-width: calc(100% - #{$minWidthSideBar} - #{$widthSideBar} + 20px);
  margin-left: calc(#{$widthSideBar} + 20px);
}
</style>