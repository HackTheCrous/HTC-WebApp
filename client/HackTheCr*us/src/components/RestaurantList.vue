<script>
import RestaurantCard from "../components/RestaurantCard.vue";
import {useUserStore} from "@/stores/user";
import {useRestaurantStore} from "@/stores/restaurants";
import LoadingFillerBox from "@/components/LoadingFillerBox.vue";

export default {
    components: {
        LoadingFillerBox,
        RestaurantCard
    },
    setup(){
        const userStore = useUserStore();
        const restaurantStore = useRestaurantStore();
        return {
            userStore,restaurantStore
        }
    },
    props:{
        restaurants: Object,
        tag:String,
        sort: String
    },
    computed: {
        filteredRestaurants(){
            const favoriteNames = this.userStore.getNames;

            let restaurantList;


            if(this.tag === "Tout"){
                restaurantList = this.restaurantStore.getRestaurants.map(restaurant => restaurant);
            }else if(this.tag === "Favoris"){
                restaurantList = this.restaurantStore.getRestaurants.filter(restaurant => favoriteNames.includes(restaurant.name)).map(restaurant => restaurant);
            }else{
                restaurantList = this.restaurantStore.getRestaurants.filter(restaurant => restaurant.name.includes(this.tag)).map(restaurant => restaurant);
            }


            restaurantList=restaurantList.sort((a,b) => {
                if(a.distance < b.distance){
                    return -1;
                }else if(a.distance > b.distance){
                    return 1;
                }else{
                    return 0;
                }
            });

            if(this.sort==='Favoris') {
                return restaurantList.sort((a, b) => {
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
        }
    }
}
</script>

<template>
    <div id="restaurants" v-if="!this.restaurantStore.isLoading">
        <RestaurantCard class="restaurant" v-for="restaurant in this.filteredRestaurants" :idRestaurant="restaurant.idrestaurant" :name="restaurant.name" :url="restaurant.url" :key="restaurant.idrestaurant"/>
    </div>
    <div id="restaurants" v-else>
        <LoadingFillerBox width="100%" height="100px">Récupération des restaurants...</LoadingFillerBox>
    </div>
</template>

<style>
    .loading-box{
        margin-top:30px;
    }
</style>