<template>
  <section id="register">
    <main>
      <form>
        <h2>Se connecter</h2>
        <h4>
          Bienvenue ! Entrez vos informations pour rejoindre hack the cr*us
        </h4>
        <div>
          <label for="mail">Email</label>
          <input
            v-model="mail"
            type="email"
            name="mail"
            id="mail"
            placeholder="Entrez votre mail"
          />
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <input
            type="password"
            v-model="password"
            name="password"
            id="password"
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <button @click="submit">Se connecter</button>
        <div class="label-inline">
          <input
            type="checkbox"
            name="remember"
            id="remember"
            v-model="remember"
          />
          <label for="remember">Se souvenir de moi</label>
        </div>

        <span>
          <p>Vous n'avez pas de compte ?</p>
          <router-link to="/register">Inscrivez-vous</router-link>
        </span>
      </form>
    </main>
    <aside>
      <div id="sun">
        <div id="round"></div>
        <div id="sea"></div>
      </div>
    </aside>
  </section>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useAlertsStore } from "@/stores/alerts";

import { endpoint } from "@/main";
import { useRestaurantStore } from "../stores/restaurants";

export default {
  name: "Login",
  emits: ["triggerAlert"],

  data() {
    return {
      mail: "",
      password: "",
      redirect: this.$route.path.includes("/login/redirect"),
      remember: false,
    };
  },
  setup() {
    const userStore = useUserStore();
    const alertStore = useAlertsStore();
    const restaurantStore = useRestaurantStore();
    return { userStore, alertStore, restaurantStore };
  },
  methods: {
    submit(e) {
      e.preventDefault();
      this.restaurantStore.startLoading();
      axios
        .post(`${endpoint}/login`, {
          mail: this.mail,
          password: this.password,
          remember: this.remember,
        })
        .then((res) => {
          if(this.remember){
            console.log(res.data.refreshToken);
            this.userStore.setRefreshToken(res.data.refreshToken);
          }
          this.userStore.login(res.data.mail, res.data.token).then(() => {
            this.alertStore.addAlert({
              message: "Vous êtes connecté !",
              status: "Success",
            });
            if (this.redirect) {
              this.$router.push(
                "/register/confirmation/" + this.$route.params.nonce
              );
            } else {
              this.restaurantStore.setRestaurants();

              this.$router.push("/");
            }
          });
        })
        .catch((err) => {
          this.restaurantStore.stopLoading();
          this.alertStore.addAlert({
            message: "Erreur d'authentification : " + err,
            status: "Error",
          });
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/login.scss";
</style>
