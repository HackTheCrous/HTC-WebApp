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

            this.restaurantStore.setTag(this.tag);
            this.restaurantStore.setSort(this.sort);

            if(this.$route.query.search != null){
                console.log(this.$route.query.search)
                this.restaurantStore.setFocus(this.$route.query.search);
            }



            return this.restaurantStore.getSortedRestaurants;
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