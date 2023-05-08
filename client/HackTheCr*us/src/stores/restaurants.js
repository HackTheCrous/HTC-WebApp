import {defineStore} from "pinia";
import {apolloClient} from "@/main";
import gql from "graphql-tag";
import {useUserStore} from "@/stores/user";

const GET_RESTAURANTS = gql`
    query Restaurants{
        restaurants{
            idrestaurant
            name
            url
            distance
        }
    }`;

export const useRestaurantStore = defineStore('restaurant', {
    state: () => ({
        restaurants: [],
        loading: false
    }),
    getters: {
        getRestaurants(state) {
            if(state.restaurants.length === 0){
                this.setRestaurants();
            }
            return state.restaurants;
        },
        isLoading(state){
            return state.loading;
        }
    },
    actions: {
        startLoading() {
            this.loading = true;
        },
        stopLoading() {
            this.loading = false;
        },
        setRestaurants() {
            this.loading = true;

            const userStore = useUserStore();
            if(!userStore.isLogged){
                console.log('not logged');
                this.loading = false;

                return;
            }
            apolloClient.query({
                query: GET_RESTAURANTS,
            }).then((result) => {
                this.restaurants = result.data.restaurants;
                this.loading = false;
            }).catch((error) => {
                this.loading = false;

            });
        }
    },
});