import {defineStore} from "pinia";
import {hydrate, provide} from "vue";
import {provideApolloClient} from "@vue/apollo-composable";
import {apolloClient} from "@/main";
import gql from "graphql-tag";
import {useCalendarStore} from "@/stores/calendar";

export const useUserStore = defineStore('user', {
    state: () => ({
        mail: '',
        token: '',
        name: '',
        logged: false,
        ical: '',
        nonce:true,
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
            return state.favorites.map((favorite) => favorite.name);
        },
        getSchool: (state) => {
            if(state.school.status === 'no data' ){
                return false;
            }
            return state.school;
        },
        getIcal: (state) => {
            return state.ical;
        },
        isMailSet: (state) => {
            return state.nonce;
        }

    },
    actions: {
        //set the store
        login(mail, token) {
            this.mail = mail;
            this.token = token;
            this.logged = true;
            return this.getData();
        },
        getData() {
            const GET_DATA_USER = gql`
                query User{
                    user{
                        name
                        ical
                        nonce
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

            return apolloClient.query({
                query: GET_DATA_USER,
            }).then((result) => {
                this.name = result.data.user.name || '';
                this.ical = result.data.user.ical;
                this.nonce = result.data.user.nonce;
                if(result.data.user.school){
                    this.school = result.data.user.school;

                }else{
                    this.school = {status: 'no data'};

                }

                this.favorites = result.data.user.favorites;

                return new Promise((resolve, reject) => {
                    resolve('resolved');
                });
            }).catch((error) => {
            });

        },
        setName(name) {
            this.name = name;
            return this.name;
        },
        setIcal(ical) {
            this.ical = ical;
        },
        setFavorites(favorites) {
            this.favorites = favorites;
        },
        setSchool(school) {
            this.school = school;
        },
        //clean the store
        logout() {

            const calendarStore = useCalendarStore();

            apolloClient.resetStore();
            this.mail = '';
            this.token = '';
            this.nonce = true;
            this.ical = '';
            this.school = {status: 'no data'};
            this.favorites = [];
            this.logged = false;
            this.name = '';
            calendarStore.clean();
        },
    },
    persist: true,
},);


