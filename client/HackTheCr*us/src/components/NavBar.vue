<template>
    <div id="navbar">
        <div class="navbar-content">
            <div class="navbar-title">
                <router-link to="/">
                    <img src="../assets/logo.png" alt="logo" class="logo">
                </router-link>
            </div>
            <div class="navbar-tools desktop">
                <router-link to="/restaurants">
                    <restaurant size="32px"></restaurant>
                </router-link>
                <router-link to="/calendar">
                    <calendar size="32px"></calendar>
                </router-link>
            </div>

        </div>
        <div class="navbar-tools desktop">
            <router-link to="/account">
                <gear size="32px" color="black"></gear>
            </router-link>

            <button @click="this.logout">
                <signout color="black"/>
            </button>
        </div>

        <div class="navbar-tools mobile">
            <router-link to="/calendar">
                <calendar size="32px"></calendar>
            </router-link>
            <router-link to="/">
                <restaurant size="32px"></restaurant>
            </router-link>
            <router-link to="/account">
                <gear size="32px" color="black"></gear>
            </router-link>
            <button @click="this.logout">
                <signout color="black"/>
            </button>

        </div>
    </div>
</template>

<script>
import account from "@/assets/account.vue";
import Calendar from "@/assets/calendar.vue";
import Restaurant from "@/assets/restaurant.vue";
import Gear from "@/assets/gear.vue";
import Signout from "@/assets/signout.vue";
import axios from "axios";
import {endpoint} from "@/main";
import {useUserStore} from "@/stores/user";
import {useAlertsStore} from "@/stores/alerts";

export default {
    name: "NavBar",
    components: {Signout, Gear, Restaurant, Calendar, account},
    data() {
        return {
            showSettings: false
        }
    },
    setup() {
        const userStore = useUserStore();
        const alerts = useAlertsStore();
        return {userStore, alerts}
    },
    methods: {
        logout(e) {
            e.preventDefault();
            axios.post(`${endpoint}/logout`, {}, {
                headers: axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.userStore.token
            }).then(res => {
                console.log(res);
                this.userStore.logout();
                this.$router.push('/login');
                this.alerts.addAlert({message: 'Vous êtes déconnecté !', status: 'Success'});
            }).catch(err => {
                this.userStore.logout();
                this.alerts.addAlert({message: err.response.data, status: 'Error'});
                console.log("ERR" + err);
            });
        }
    }
}
</script>

<style scoped lang="scss">

@keyframes selected {
  0% {
    transform: rotate(0deg);
  }
  30% {
    transform: rotate(10deg);
  }
  80% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0deg);
  }

}

#navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  height: 100%;
  background: var(--color-background);
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-right: 1px solid var(--color-border);
  box-shadow: 0px 0px 10px 0px var(--color-shadow);

  @media screen and (max-width: 1000px) {
    border-right: 0px;
    border-top: 1px solid var(--color-border);
    box-shadow: 0px 10px 10px 10px var(--color-shadow);

    padding: 10px 0px;
    width: 100%;
    height: fit-content;
    flex-direction: row;
    justify-content: space-between;
    bottom: 0;
    top: auto;
  }

  .navbar-content {
    .navbar-title {
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 20px;
      margin-bottom: 15px;
      @media screen and (max-width: 1000px) {
        display: none;
      }
    }
  }


  .navbar-tools {


    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 1000px) {
      flex-direction: row;

    }


    a, button {
      border: 0px solid transparent;
      background: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-top: 5px;
      width: 100%;
      border-radius: 10px;

      @media screen and (max-width: 1000px) {
        width: fit-content;
        padding-left: 10px;
        padding-right: 10px;
        margin: 0px 10px;
      }

      &:hover {
        background: var(--color-background-soft);
      }

      svg {
        opacity: 0.7;
      }

      &.router-link-active {
        background: var(--color-background-soft);

        svg {
          opacity: 1;
          animation: selected 0.2s;
        }
      }
    }

    &.desktop {
      @media screen and (max-width: 1000px) {
        display: none;
      }
    }

    &.mobile {
      display: none;
      @media screen and (max-width: 1000px) {
        display: flex;
        width: 100%;
        justify-content: space-around;
      }
    }


  }


}
</style>