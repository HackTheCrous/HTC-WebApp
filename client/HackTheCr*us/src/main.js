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
import {onError} from "@apollo/client/link/error";



const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
})

const cache = new InMemoryCache();

const pinia = createPinia();




pinia.use(piniaPluginPersistedState)






const authMiddleware = () => new ApolloLink((operation, forward) => {
    const token = userStore.getToken;
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : null,
        }
    });
    return forward(operation);
});


//manage errors. If the token is expired, we logout the user
const errorLink = onError(({graphQLErrors, networkError}) => {
   if(graphQLErrors){
       for(let err of graphQLErrors){
           if(err.extensions.code === "UNAUTHENTICATED"){
               userStore.logout();
           }
           if(err.message==="jwt expired"){
                userStore.logout();
           }
       }
   }
});

export const apolloClient = new ApolloClient({
    link: errorLink.concat(authMiddleware()).concat(httpLink),
    cache,
});



const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },

    render: () => h(App)
})

app.use(pinia);
const userStore = useUserStore(); //c'est dégueulasse mais ça marche




app.use(router).mount('#app');