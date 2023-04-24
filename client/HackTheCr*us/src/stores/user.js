import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        mail: '',
        token: '',
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
        }
    },
    actions: {
        login(mail, token) {
            this.mail = mail;
            this.token = token;
            this.logged = true;
        },
        logout() {
            this.mail = '';
            this.token = '';
            this.logged = false;
        }
    },
    persist: true,
},);


