<script>
import RestaurantCard from "../components/RestaurantCard.vue";
import {useUserStore} from "@/stores/user";
import {useRestaurantStore} from "@/stores/restaurants";
import LoadingFillerBox from "@/components/LoadingFillerBox.vue";
import TagPlace from "@/components/TagPlace.vue";

export default {
    name: "RestaurantList",
    components: {
        TagPlace,
        LoadingFillerBox,
        RestaurantCard
    },
    data(){
      return{
          restaurants : this.restaurantStore.getRestaurants,
          sort: 'Favoris',
          focusSearch: false,
          tags: [{name: 'Tout'}, {name: 'Resto'}, {name: 'Cafet’'}, {name: 'Brasserie'}],
          focusedTag: 'Tout',
          username: '',
          keyPressed: []

      }
    },
    setup(){
        const userStore = useUserStore();
        const restaurantStore = useRestaurantStore();
        console.log('test')

        return {
            userStore,restaurantStore
        }
    },
    computed: {
        filteredRestaurants(){

            this.restaurantStore.setTag(this.focusedTag);
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
    <div id="tags">
        <!--La façon dont le focus est gérée est dégueulasse-->
        <TagPlace v-for="tag in tags" :name="tag.name" :focused="this.focusedTag"
                  @child-clicked="this.focusedTag=tag.name"
                  :key="tag.name"/>
        <div class="filler"></div>
        <select v-model="this.sort">
            <option>Favoris</option>
            <option>Proximité</option>
        </select>
    </div>
    <main>

        <div id="restaurants" v-if="!this.restaurantStore.isLoading">
            <TransitionGroup name="list" tag="div">
                <RestaurantCard class="restaurant" v-for="restaurant in this.filteredRestaurants" :idRestaurant="restaurant.idrestaurant" :name="restaurant.name" :url="restaurant.url" :key="restaurant.idrestaurant"/>
            </TransitionGroup>
        </div>
        <div id="restaurants" v-else>
            <LoadingFillerBox width="100%" height="100px">Récupération des restaurants...</LoadingFillerBox>
        </div>
    </main>
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


    #tags {
        margin-bottom: 20px;
        display: flex;
        flex-direction: row;
        position: relative;
        z-index: 1;
        width: 100%;

        @media screen and (max-width: 1000px) {
            width: 95vw;
        }


        .filler {
            flex-grow: 1;
            border-bottom: solid 1px var(--color-border);
        }

        select {

            border: none;
            background: none;
            font-family: Inter, sans-serif;

            font-size: 15px;
            padding-bottom: 10px;
            padding-right: 5px;
            font-weight: 200;
            color: var(--color-text);
            border-bottom: solid 1px var(--color-border);
            outline: none;

            option {
                font-family: Inter, sans-serif;
                border: none;

                &:hover {
                    background: var(--color-background-soft);

                }
            }
        }
    }
</style>