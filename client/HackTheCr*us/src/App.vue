<template>
    <main>
        <Alert v-if="this.alertTriggered" :msg="this.alert.msg" :type="this.alert.status"/>
        <div id="nav" v-if="this.userStore.logged" :class="reduceBar ? 'squeezed' : '' ">
            <router-link to="/" id="logo">
                <img src="./assets/logoV2.png" alt="logo">
                <h4 v-if="!reduceBar">hack<br/><span>the cr*us</span></h4>
            </router-link>
            <div id="tools">
                <router-link class="icon" to="/" v-slot="{isActive}">
                    <restaurant size="35" class="active" v-if="isActive" opacity="1"/>
                    <restaurant size="35" v-else opacity="0.5"/>
                    <p v-if="!reduceBar">Restaurants</p>
                </router-link>
                <router-link class="icon" to="/calendar" v-slot="{isActive}">
                    <calendar size="35" class="active" v-if="isActive" opacity="1"/>
                    <calendar size="35" v-else opacity="0.5"/>
                    <p v-if="!reduceBar">Agenda</p>
                </router-link>
                <router-link class="icon" to="/account" v-slot="{isActive}">
                    <account size="35" class="active" v-if="isActive" opacity="1"/>
                    <account size="35" v-else opacity="0.5"/>
                    <p v-if="!reduceBar">Mon compte</p>
                </router-link>
            </div>
            <button @click="reduceBar=!reduceBar" class="icon" id="squeeze">
                <squeeze size="30" opacity="0.5" color="white"/>
            </button>
        </div>

        <div id="content" v-if="this.userStore.logged" :class="reduceBar ? 'squeezed' : '' ">
            <router-view/>
        </div>
        <div id="content" v-else class="notLogged">
            <router-view/>
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
import Calendar from "@/assets/calendar.vue";

export default {
    name: "App",
    components: {Calendar, Alert, squeeze, account, search, restaurant},
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
            if (this.alerts.hasNext) {

                const alert = this.alerts.getLastAlert;

                this.alert.msg = alert.message;
                this.alert.status = alert.status;
                this.alertTriggered = true;

                console.log(this.alert);

                setTimeout(() => {
                    this.alertTriggered = false;
                    this.alerts.popAlert();
                    this.triggerAlert();


                }, 3000)

            }
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
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
}

#nav {
  width: $widthSideBar;
  min-width: $minWidthSideBar;
  @media screen and (max-width: 1000px) {
    width: 100%;
    backdrop-filter: blur(4px);
    z-index: 1000;
  }

  border-top: 1px solid var(--color-border);
  box-shadow: 0px 0px 10px 0px var(--color-shadow);

  #logo {
    margin-top: 15px;
    @media screen and (max-width: 1000px) {
      margin-top: 0px;
      display: none;
    }
  }


  &.squeezed {
    width: fit-content;
    min-width: fit-content;

    @media screen and (max-width: 1000px) {
      width: 100%;
      min-width: 100%;
      padding-left: 10%;
      padding-right: 10%;
    }

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
  background: var(--color-background);
  padding-top: 10px;
  padding-bottom: 10px;

  position: fixed;
  @media screen and (max-width: 1000px) {
    height: fit-content;
    bottom: 0;
    width: 100%;
    flex-direction: row;
    margin: 0;
    padding-bottom: 0;
    padding-top: 0;
  }

  a {
    padding-left: $paddingIcons;

    color: var(--color-text);
    font-family: Inter, sans-serif;
    font-size: 20px;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;

    p {
      font-weight: 300;
      opacity: 0.5;
    }

    h4 {
      font-weight: 300;
      line-height: 17px;
    }

    text-wrap: avoid;

    padding-left: $paddingIcons;
    padding-right: calc($paddingIcons - 10px);


    svg {
      margin-right: calc($paddingIcons - 15px);;
    }

    &.router-link-active {
      color: var(--color-text);

      p {
        font-weight: 500;
        opacity: 1;
      }
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
    @media screen and (max-width: 1000px) {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;
    }

    a {
      margin-bottom: 15px;
      margin-top: 15px;
      @media screen and (max-width: 1000px) {

        margin-bottom: 0;
        margin-top: 0;
      }
    }
  }

  #squeeze {
    @media screen and (max-width: 1000px) {
      display: none;
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
      padding-top: 5px;
      padding-bottom: 5px;
    &.router-link-active {
      border-left: 5px solid var(--color-text);
      padding-left: calc($paddingIcons - 5px);
      @media screen and (max-width: 1000px) {
          padding-top: 5px;
        border-left: 0px;
        border-bottom: 5px solid var(--color-text);
      }
    }
  }
}

#content {
  overflow-y: hidden;
  margin-top: 30px;
  width: calc(100% - #{$widthSideBar} - #{$minWidthSideBar} + 30px);
  min-width: calc(100% - #{$minWidthSideBar} - #{$widthSideBar} + 30px);
  margin-left: calc(#{$widthSideBar} + 30px);


  &.squeezed {
    width: calc(100% - 100px - 60px);
    min-width: calc(100% - 100px - 60px);
    margin-left: calc(100px + 20px);
    @media screen and (max-width: 1000px) {
      width: 100%;
      min-width: 100%;
      margin-left: 10px;
      margin-right: 10px;
      margin-top: 20px;
    }
  }

  &.notLogged {
    margin-top: 0px;
    margin-left: 0px;
    width: 100%;
  }
}
</style>