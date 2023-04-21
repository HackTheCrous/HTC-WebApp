import {createApp, h, provide} from 'vue'
import App from './App.vue'
import router from "@/router";

import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client/core";


import './assets/main.css'
import {DefaultApolloClient} from "@vue/apollo-composable";


const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
})

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
});

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },

    render: () => h(App)
})


app.use(router).mount('#app');