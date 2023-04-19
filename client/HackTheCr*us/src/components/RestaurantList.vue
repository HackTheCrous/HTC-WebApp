<template>
    <div id="restaurants">
        <RestaurantCard class="restaurant" v-for="restaurant in this.filteredRestaurants" :name="restaurant.name" :url="restaurant.url" :key="restaurant.idrestaurant"/>
    </div>
</template>

<script>
import RestaurantCard from "@/components/RestaurantCard.vue";

export default {
    components: {
        RestaurantCard
    },
    props:{
        restaurants: Object,
        tag:String,

    },
    computed: {
        filteredRestaurants(){
            return this.tag === 'Tout' ? this.restaurants : this.restaurants.filter((restaurant) => restaurant.name.includes(this.tag));
        }
    }
}
</script>

<style>

</style>