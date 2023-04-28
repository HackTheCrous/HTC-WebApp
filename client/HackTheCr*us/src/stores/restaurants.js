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
        }
    }`;

export const useRestaurantStore = defineStore('restaurant', {
    state: () => ({
        restaurants: [],
    }),
    getters: {
        getRestaurants(state) {
            if(state.restaurants.length === 0){
                this.setRestaurants();
            }
            console.log(state.restaurants)
            return state.restaurants;
        },
    },
    actions: {
        setRestaurants() {
            apolloClient.query({
                query: GET_RESTAURANTS,
            }).then((result) => {
                this.restaurants = result.data.restaurants;
            });
        }
    },
});