import {defineStore} from "pinia";
import {hydrate, provide} from "vue";
import {provideApolloClient} from "@vue/apollo-composable";
import {apolloClient} from "@/main";
import gql from "graphql-tag";

export const useUserStore = defineStore('user', {
    state: () => ({
        mail: '',
        token: '',
        name: '',
        logged: false,
    }),

    getters: {
        isLogged: (state) => {
            return state.logged;
        },
        getMail: (state) => {
            return state.mail;
        },
        getToken: (state) => {
            return state.token;
        },
        getState: (state) => {
            return state;
        },
        getName: (state) => {
            if(state.name === ''){
                const GET_USER_FROM_TOKEN = gql`
                    query {
                        user{
                            name
                            iduser
                            mail
                        }
                    }`;

                apolloClient.query({
                    query: GET_USER_FROM_TOKEN,
                }).then((response) => {
                    state.mail = response.data.user.mail;
                    state.logged = true;
                    state.name = response.data.user.name;
                });
            }
            return state.name;
        }
    },
    actions: {
        //set the store
        login(mail, token) {
            this.mail = mail;
            this.token = token;
            this.logged = true;
        },
        hydrate(state) {


        },
        //clean the store
        logout() {
            this.mail = '';
            this.token = '';
            this.logged = false;
            this.name='';
        }
    },
    persist: true,
},);


