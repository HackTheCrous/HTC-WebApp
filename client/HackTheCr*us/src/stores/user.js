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
        ical: '',
        school: {},
        favorites: [],
        provided: false,
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
            if(!state.provided){
                state.getData();
            }
            return state.name;
        },
        getFavorites: (state) => {
            if(!state.provided){
                state.getData();
            }
            return state.favorites;
        }
    },
    actions: {
        //set the store
        login(mail, token) {
            this.mail = mail;
            this.token = token;
            this.logged = true;
        },
        getData() {
            this.provided = true;

            const GET_DATA_USER = gql`
                query User{
                    user{
                        name
                        ical
                        school {
                            idschool
                            name
                        }
                        favorites {
                            idrestaurant
                            url
                            name
                        }
                    }
                }
            `;

            apolloClient.query({
                query: GET_DATA_USER,
            }).then((result) => {
                this.name = result.data.user.name;
                this.ical = result.data.user.ical;
                this.school = result.data.user.school;
                this.favorites = result.data.user.favorites;
            }).catch((error) => {
                this.provided = false;
            });

        },
        setName() {
            return this.name;
        },
        //clean the store
        logout() {
            this.mail = '';
            this.token = '';
            this.ical = '';
            this.school= {};
            this.favorites = [];
            this.logged = false;
            this.name='';
            this.provided = false;
        }
    },
    persist: true,
},);


