import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import Home from '@/views/Home.vue';
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import RestaurantDetail from "@/views/RestaurantDetail.vue";
import RegistrationConfirmation from "@/views/RegistrationConfirmation.vue";
import Account from "@/views/Account.vue";
import Calendar from "@/assets/calendar.vue";
import CalendarDetails from "@/views/CalendarDetails.vue";
import EventDetails from "@/components/EventDetails.vue";
import UserSettings from "@/views/UserSettings.vue";
import RestaurantsView from "@/views/RestaurantsView.vue";
import RestaurantList from "@/components/RestaurantList.vue";


const routes = [
    {
        path: '/',
        redirect: '/restaurants'
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
        path: '/register/confirmation/:nonce',
        name: 'RegistrationConfirmation',
        component: RegistrationConfirmation
    },
    {
        path: '/account',
        name: 'UserSettings',
        component: UserSettings
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: CalendarDetails,
        children: [
            {
                path: ':timestamp',
                name: 'EventDetails',
                component: EventDetails
            }
        ]
    },
    {
        path:'/restaurants',
        name: 'RestaurantsView',
        component: RestaurantsView,
        children : [
            {
              path:'',
              name: 'RestaurantList',
                component: RestaurantList
            },
            {
                path: ':id',
                name: 'RestaurantDetail',
                component: RestaurantDetail
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(), //process.env.BASE_URL should get the url of our server
    routes
});

export default router
