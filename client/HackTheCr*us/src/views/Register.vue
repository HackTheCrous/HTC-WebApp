<template>
    <h1>Vue Register</h1>
    <section id="register">
        <main>
            <form>
                <h2>Bienvenue !</h2>
                <h4>Bienvenue ! Entrez vos informations pour rejoindre hack the cr*us</h4>
                <div>
                    <label for="mail">Email*</label>
                    <input required v-model="mail" type="email" name="mail" id="mail" placeholder="Entrez votre mail"/>
                </div>
                <div>
                    <label for="password">Mot de passe*</label>
                    <input required v-model="password" type="password" name="password" id="password"
                           placeholder="Entrez votre mot de passe"/>
                </div>
                <div>
                    <label for="passwordConfirmation">Mot de passe (confirmation)*</label>
                    <input required :class="passwordMatch" v-model="passwordConfirmation" type="password"
                           name="passwordConfirmation"
                           id="passwordConfirmation" placeholder="Répétez votre mot de passe"/>
                </div>

                <button v-if="passwordMatch!=='green'" disabled @click="submit" class="disabled">S'enregister</button>
                <button v-else @click="submit">S'enregister</button>
                <span>
                    <p>Vous avez déjà un compte ? </p> <router-link to="/login">Connectez-vous</router-link>
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
    name: "Register",

    data() {
        return {
            mail: '',
            password: '',
            passwordConfirmation: ''
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
            if (this.password === this.passwordConfirmation) {
                axios.post(`http://localhost:4000/signup`, {
                    mail: this.mail,
                    password: this.password
                }).then((response) => {
                    switch (response.data.type) {
                        case 'Success':
                            this.userStore.login(response.data.mail, response.data.token);
                            this.alertStore.addAlert({message: 'Vous êtes connecté !', status: 'Success'});
                            this.$router.push({name: 'Home', query: {redirect: '/'}});
                            break;
                        default:
                            this.alertStore.addAlert({message: response.data.message, status: 'Error'});
                            break;
                    }

                }).catch((error) => {
                    console.error(error)
                    this.alertStore.addAlert({message:error, status: 'Error'});
                })
            } else {
                this.alertStore.addAlert({message:'Les mots de passes doivent correspondre', status: 'Error'});
            }
        }
    },
    computed: {
        passwordMatch() {
            return (this.mail.length > 0 && this.password.length > 5 && this.password === this.passwordConfirmation) ? 'green' : 'red';
        }
    }


}
</script>

<style scoped lang="scss">
@import '@/styles/login.scss';

</style>