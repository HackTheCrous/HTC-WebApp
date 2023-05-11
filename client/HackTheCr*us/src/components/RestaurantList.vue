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
        <TransitionGroup name="list" tag="ul">
            <RestaurantCard class="restaurant" v-for="restaurant in this.filteredRestaurants" :idRestaurant="restaurant.idrestaurant" :name="restaurant.name" :url="restaurant.url" :key="restaurant.idrestaurant"/>
        </TransitionGroup>
    </div>
    <div id="restaurants" v-else>
        <LoadingFillerBox width="100%" height="100px">Récupération des restaurants...</LoadingFillerBox>
    </div>
</template>

<style scoped lang="scss">
    .loading-box{
        margin-top:30px;
    }
    .list-move, /* apply transition to moving elements */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    /* ensure leaving items are taken out of layout flow so that moving
       animations can be calculated correctly. */
    .list-leave-active {
        position: absolute;
    }
</style>