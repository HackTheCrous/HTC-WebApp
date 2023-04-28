<script>
import RestaurantCard from "../components/RestaurantCard.vue";
import {useUserStore} from "@/stores/user";
import {useRestaurantStore} from "@/stores/restaurants";

export default {
    components: {
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
        
    },
    computed: {
        filteredRestaurants(){
            const favoriteNames = this.userStore.getNames;
            if(this.tag === "Tout"){
                return this.restaurantStore.getRestaurants;
            }else if(this.tag === "Favoris"){
                return this.restaurantStore.getRestaurants.filter(restaurant => favoriteNames.includes(restaurant.name));
            }else{
                return this.restaurantStore.getRestaurants.filter(restaurant => restaurant.name.includes(this.tag));
            }
        }
    }
}
</script>

<template>
    <div id="restaurants">
        <RestaurantCard class="restaurant" v-for="restaurant in this.filteredRestaurants" :idRestaurant="restaurant.idrestaurant" :name="restaurant.name" :url="restaurant.url" :key="restaurant.idrestaurant"/>
    </div>
</template>

<style>

</style>