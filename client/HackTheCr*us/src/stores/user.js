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
        school: {status: 'no data'},
        favorites: [],
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
            return state.name;
        },
        getFavorites: (state) => {

            return state.favorites;
        },
        getNames: (state) => {
            console.log(state.favorites);
            return state.favorites.map((favorite) => favorite.name);
        },
        getSchool: (state) => {
            if(state.school.status === 'no data' ){
                return false;
            }
            return state.school;
        },

    },
    actions: {
        //set the store
        login(mail, token) {
            this.mail = mail;
            this.token = token;
            this.logged = true;
            this.getData();
        },
        getData() {
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
                this.name = result.data.user.name || '';
                this.ical = result.data.user.ical;
                if(result.data.user.school){
                    this.school = result.data.user.school;

                }else{
                    this.school = {status: 'no data'};

                }

                this.favorites = result.data.user.favorites;
            }).catch((error) => {
            });

        },
        setName() {
            return this.name;
        },
        setFavorites(favorites) {
            this.favorites = favorites;
        },
        //clean the store
        logout() {
            apolloClient.resetStore();
            this.mail = '';
            this.token = '';
            this.ical = '';
            this.school = {status: 'no data'};
            this.favorites = [];
            this.logged = false;
            this.name = '';
        },
    },
    persist: true,
},);


