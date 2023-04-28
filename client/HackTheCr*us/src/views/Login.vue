<template>
    <h1>Vue Login</h1>
    <section id="register">
        <main>
            <form>
                <h2>Bienvenue !</h2>
                <h4>Bienvenue ! Entrez vos informations pour rejoindre hack the cr*us</h4>
                <div>
                    <label for="mail">Email</label>
                    <input v-model="mail" type="email" name="mail" id="mail" placeholder="Entrez votre mail"/>
                </div>
                <div>
                    <label for="password">Mot de passe</label>
                    <input type="password" v-model="password" name="password" id="password"
                           placeholder="Entrez votre mot de passe"/>
                </div>


                <button @click="submit">Se connecter</button>
                <span>
                    <p>Vous n'avez pas de compte ?</p> <router-link to="/register">Inscrivez-vous</router-link>
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
import {useUserStore} from "@/stores/user";
import {useAlertsStore} from "@/stores/alerts";


export default {
    name: "Login",
    emits: ['triggerAlert'],

    data() {
        return {
            mail: '',
            password: '',
            redirect: this.$route.path.includes('/login/redirect')
        }
    },
    setup() {
        const userStore = useUserStore();
        const alertStore = useAlertsStore();
        return {userStore, alertStore}
    },
    methods: {
        submit(e) {
            e.preventDefault();
            axios.post(`http://localhost:4000/login`, {
                mail: this.mail,
                password: this.password
            }).then(res => {
                this.userStore.login(res.data.mail, res.data.token);
                console.log(this.userStore.getToken)
                this.alertStore.addAlert({message: 'Vous êtes connecté !', status: 'Success'});
                if (this.redirect) {
                    this.$router.push('/register/confirmation/'+this.$route.params.nonce);
                } else {
                    this.$router.push('/');
                }
            }).catch(err => {
                this.alertStore.addAlert({message: "Erreur d'authentification : " + err, status: 'Error'});
                console.log(err);
            })
        }
    }
}
</script>

<style scoped lang="scss">

@import '@/styles/login.scss';

</style>