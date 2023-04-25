import {createApp, h, provide} from 'vue'
import {createPinia} from "pinia";
import App from './App.vue'
import router from "@/router";

import piniaPluginPersistedState from "pinia-plugin-persistedstate";

import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client/core";


import './assets/main.css'
import {DefaultApolloClient} from "@vue/apollo-composable";
import {ApolloLink, concat, HttpLink} from "apollo-boost";
import {useUserStore} from "@/stores/user";


const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
})

const cache = new InMemoryCache();

const pinia = createPinia();



pinia.use(piniaPluginPersistedState)

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },

    render: () => h(App)
})


app.use(pinia);


const userStore = useUserStore(); //c'est dégueulasse mais ça marche

const authMiddleware = (token) => new ApolloLink((operation, forward) => {

    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : null,
        }
    });
    return forward(operation);
});

export const apolloClient = new ApolloClient({
    link: concat(authMiddleware(userStore.token),httpLink),
    cache,
});



app.use(router).mount('#app');