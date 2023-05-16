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
            coords{
                x
                y
            }
        }
    }`;

const GET_RESTAURANT = gql`
    query Restaurant($url: String){
        restaurant(url: $url){
            distance
            meals{
                idmeal
                typemeal
                foodies
                day
            }
        }
    }`;

export const useRestaurantStore = defineStore('restaurant', {
    state: () => ({
        restaurants: [],
        loading: false,
        filters:{
            tag: '',
            sort: '',
            focus: ''
        },
        nbMeals: 0,
    }),
    getters: {
        getRestaurants(state) {
            if(state.restaurants.length === 0){
                this.setRestaurants();
            }
            return state.restaurants;
        },
        getSortedRestaurants(state){
            const userStore = useUserStore();
            const favoriteNames = userStore.getNames;

            if(state.restaurants.length === 0){
                this.setRestaurants();
            }


            let restaurantList = state.restaurants;


            if(state.filters.tag.includes('Tout')){
                restaurantList = restaurantList.map(restaurant => restaurant);
            }else{
                restaurantList = restaurantList.filter(restaurant => restaurant.name.includes(state.filters.tag)).map(restaurant => restaurant);
            }

            restaurantList = restaurantList.sort((a, b) => {
                if(a.distance < b.distance){
                    return -1;
                }else if(a.distance > b.distance){
                    return 1;
                }else{
                    return 0;
                }
            });

            if(state.filters.sort.includes('Favoris')){
                restaurantList = restaurantList.sort((a, b) => {
                    if (favoriteNames.includes(a.name) && !favoriteNames.includes(b.name)) {
                        return -1;
                    } else if (!favoriteNames.includes(a.name) && favoriteNames.includes(b.name)) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
            }
            return restaurantList;

        },
        getMeal(state) {
            return (url) => state.restaurants.filter(restaurant => restaurant.url === url)[0].meals;
        },
        getDistance(state) {
            return (url) => state.restaurants.filter(restaurant => restaurant.url === url)[0].distance;

        },
        isLoading(state){
            return state.loading;
        },

    },
    actions: {
        sortByFocus(){
            if(this.filters.focus === ''){
                return this.restaurants;
            }
            return this.restaurants.sort((a, b) => {
                const mealA = this.getMeal(a.url) ? this.getMeal(a.url).join(' ').toUpperCase() : ' ';
                const mealB = this.getMeal(b.url) ? this.getMeal(b.url).join(' ').toUpperCase() : ' ';

                if (mealA.includes(this.filters.focus) && !mealB.includes(this.filters.focus)) {
                    return 1;
                } else if (!mealA.includes(this.filters.focus) && mealB.includes(this.filters.focus)) {
                    return -1;
                } else {
                    return 0;
                }
            });
        },
        startLoading() {
            this.loading = true;
        },
        stopLoading() {
            this.loading = false;
        },
        setTag(tag){
            this.filters.tag = tag;
        },
        setSort(sort){
            this.filters.sort = sort;
        },
        setFocus(key){
            this.filters.focus = key.toUpperCase();
        },
        async setMeal(url) {
            console.log('set meal');
            const result = await apolloClient.query({
                query: GET_RESTAURANT,
                variables: {
                    url: url
                }
            });

            const meal = result.data.restaurant.meals;

            for(const restaurant of this.restaurants){
                if(restaurant.url === url){
                    restaurant.meal = meal;
                    restaurant.distance = result.data.restaurant.distance;
                    return meal;
                }
            }
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
                this.restaurants = result.data.restaurants.map((restaurant) => {
                    return {
                        ...restaurant,
                        meal: null
                    };
                });

                this.loading = false;
            }).catch((error) => {
                this.loading = false;

            });
        }
    },

});