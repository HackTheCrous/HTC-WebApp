import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import Home from '@/views/Home.vue';
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import RestaurantDetail from "@/views/RestaurantDetail.vue";
import RegistrationConfirmation from "@/views/RegistrationConfirmation.vue";
import Account from "@/views/Account.vue";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
      path: '/login/redirect/:nonce',
        name: 'LoginRedirect',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/restaurant/:id',
        name: 'RestaurantDetail',
        component: RestaurantDetail
    },
    {
        path: '/register/confirmation/:nonce',
        name: 'RegistrationConfirmation',
        component : RegistrationConfirmation
    },
    {
        path: '/account',
        name: 'Account',
        component: Account
    }
]

const router = createRouter({
    history: createWebHistory(), //process.env.BASE_URL should get the url of our server
    routes
});

export default router
