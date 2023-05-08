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
        setRestaurants() {
            const userStore = useUserStore();
            console.log('retrieving restaurants');
            if(!userStore.isLogged){
                console.log('not logged');
                return;
            }
            this.loading = true;
            apolloClient.query({
                query: GET_RESTAURANTS,
            }).then((result) => {
                this.loading = false;
                this.restaurants = result.data.restaurants;
            });
        }
    },
});