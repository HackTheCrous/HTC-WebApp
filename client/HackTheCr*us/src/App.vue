<template>
    <main>
        <Alert v-if="this.alertTriggered" :msg="this.alert.msg" :type="this.alert.status"/>
        <div id="nav" v-if="this.userStore.logged" :class="reduceBar ? 'squeezed' : '' ">
            <router-link to="/">
                <img src="./assets/logoV2.png" alt="logo">
            </router-link>
            <div id="tools">
                <router-link class="icon" to="/login" v-slot="{isActive}">
                    <account v-if="isActive" opacity="1" color="#63F49E"/>
                    <account v-else opacity="0.5" color="white"/>
                    <p v-if="!reduceBar">Login</p>
                </router-link>
                <router-link class="icon" to="/register" v-slot="{isActive}">
                    <account v-if="isActive" opacity="1" color="#63F49E"/>
                    <account v-else opacity="0.5" color="white"/>

                    <p v-if="!reduceBar">Register</p>
                </router-link>
                <router-link class="icon" to="/" v-slot="{isActive}">
                    <restaurant v-if="isActive" opacity="1" color="#63F49E"/>
                    <restaurant v-else opacity="0.5" color="white"/>
                    <p v-if="!reduceBar">Restaurants</p>
                </router-link>
            </div>
            <button @click="reduceBar=!reduceBar" class="icon">
                <squeeze opacity="0.5" color="white"/>
            </button>
        </div>
        <div id="content" v-if="this.userStore.logged" :class="reduceBar ? 'squeezed' : '' ">
            <router-view @triggerAlert="(msg, type) => { triggerAlert(msg,type) }"/>
        </div>
        <div id="content" v-else class="notLogged">
            <router-view @triggerAlert="(msg, type) => { triggerAlert(msg,type) }"/>
        </div>
    </main>
</template>

<script>
import Alert from "./components/Alert.vue";
import squeeze from "./assets/squeeze.vue";
import account from "./assets/account.vue";
import search from "./assets/search.vue";
import restaurant from "./assets/restaurant.vue";
import {useAlertsStore} from "@/stores/alerts";
import {useUserStore} from "@/stores/user";

export default {
    name: "App",
    components: {Alert, squeeze, account, search, restaurant},
    data() {
        return {
            alertTriggered: false,
            alert: {
                msg: '',
                status: ''
            },
            reduceBar: true
        }
    },
    setup() {
        const alerts = useAlertsStore();
        const userStore = useUserStore();


        return {alerts, userStore}


    },
    mounted() {
        this.alerts.$subscribe(() => {

            this.triggerAlert();
        }, {
            detached: true
        })
    },
    methods: {
        triggerAlert() {


            const alert = this.alerts.getLastAlert;


            this.alert.msg = alert.message;
            this.alert.status = alert.status;
            this.alertTriggered = true;


            console.log(this.alert);


            setTimeout(() => {
                this.alertTriggered = false;
                this.alerts.popAlert();
                if (this.alerts.alerts.length > 0) {
                    this.triggerAlert(); //dangereux
                }
            }, 3000)


        }
    }
}
</script>

<style scoped lang="scss">

$widthSideBar: 200px;
$minWidthSideBar: 100px;
$paddingIcons: 20px;


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
  border-right: 1px solid rgba(26, 22, 22, 0.25);

  &.squeezed {
    width: fit-content;
    min-width: fit-content;

    a, button {

    }

    a svg {

      margin-right: 0;

    }

    button svg {
      transform: rotate(180deg);
      transition: transform 0.25s ease-in-out;
    }
  }

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100dvh;
  position: fixed;
  background: rgba(12, 12, 12, 0.78);
  padding-top: 10px;
  padding-bottom: 10px;

  a {
    padding-left: $paddingIcons;

    color: rgba(255, 255, 255, 0.75);
    font-family: Inter, sans-serif;
    font-size: 20px;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;

    text-wrap: avoid;

    padding-left: $paddingIcons;
    padding-right: calc($paddingIcons - 10px);


    svg {
      margin-right: calc($paddingIcons - 10px);;
    }

    &.router-link-active {
      color: #63F49E;

    }

    img {

      height: 50px;
      width: 55px;
    }
  }

  a, button {
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  #tools {
    display: flex;
    flex-direction: column;
    justify-content: center;

    a {
      margin-bottom: 5px;
      margin-top: 5px;
    }
  }

  button {
    width: 100%;
    background: transparent;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    border: none;
    padding-left: $paddingIcons;
    color: rgba(255, 255, 255, 0.75);
    font-family: Inter, sans-serif;
    font-size: 25px;

    svg {
      transition: transform 0.25s ease-in-out;
    }
  }

  .icon {

    &.router-link-active {
      border-left: 5px solid #63F49E;
      padding-left: calc($paddingIcons - 5px);
    }
  }
}

#content {
  margin-top: 30px;
  width: calc(100% - #{$widthSideBar} - #{$minWidthSideBar} + 30px);
  min-width: calc(100% - #{$minWidthSideBar} - #{$widthSideBar} + 30px);
  margin-left: calc(#{$widthSideBar} + 30px);

  &.squeezed {
    width: calc(100% - 100px - 60px);
    min-width: calc(100% - 100px - 60px);
    margin-left: calc(100px + 20px);
  }

  &.notLogged {
      margin-top: 0px;
    margin-left: 0px;
    width: 100%;
  }
}
</style>