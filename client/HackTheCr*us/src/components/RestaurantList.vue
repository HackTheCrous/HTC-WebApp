<script>
import RestaurantCard from "../components/RestaurantCard.vue";
import {useUserStore} from "@/stores/user";

export default {
    components: {
        RestaurantCard
    },
    setup(){
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    props:{
        restaurants: Object,
        tag:String,
        
    },
    computed: {
        filteredRestaurants(){
            const favoriteNames = this.userStore.getFavorites.map(restaurant => restaurant.name);
            if(this.tag === "Tout"){
                return this.restaurants;
            }else if(this.tag === "Favoris"){
                return this.restaurants.filter(restaurant => favoriteNames.includes(restaurant.name));
            }else{
                return this.restaurants.filter(restaurant => restaurant.name.includes(this.tag));
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