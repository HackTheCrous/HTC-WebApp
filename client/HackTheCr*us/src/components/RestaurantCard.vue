<template>
    <div class="restaurant">
        <h3>
            <router-link :to="getLink()" v-if="!this.loading">{{ this.name }}</router-link>
            <LoadingFillerBox width="30%" height="30px" v-if="this.loading"/>
            <span class="heart-container">
                <Transition name="likeloading">
                    <heart v-if="this.isLikeLoading()" color="#ff0000"
                           :filled="this.isFavorite()" size="20"/>
                </Transition>

                <Transition name="loading">
                    <heart v-if="!(this.isFavorite() && !this.loading && !this.isLikeLoading())" color="#24EE76" @click="this.like()"
                           :filled="this.isFavorite()" size="20"/>
                </Transition>

                <Transition name="like">
                    <heart v-if="this.isFavorite() && !this.loading && !this.isLikeLoading()" @click="this.dislike()" color="#24EE76"
                           :filled="this.isFavorite()"
                           size="20"/>
                </Transition>

            </span>

        </h3>
        <Transition name="grow">
            <div class="loading-set" v-if="this.loading">
                <LoadingFillerBox width="49%" height="100px"/>
                <LoadingFillerBox width="49%" height="100px"/>
            </div>
        </Transition>
        <div class="tags" v-if="!this.loading">
            <TagDetail v-if="this.distance !== 0"> {{ Math.round(this.distance / 10) / 100 }}km</TagDetail>
        </div>
        <Menu v-for="meal in this.restaurantStore.getMeal(this.url)" :key="meal.typemeal" :name="meal.typemeal"
              :foodies="meal.foodies"
              :time="meal.day"
              class="menu"></Menu>
        <p v-if="this.restaurantStore.getMeal(this.url).length === 0 && !this.loading" class="no-menu">Pas de menu
            disponible :(</p>
    </div>
</template>


<script>
import {useQuery} from "@vue/apollo-composable";
import gql from "graphql-tag";
import {computed} from "vue";

import Menu from '@/components/Menu.vue';
import heart from '@/assets/heart.vue';

import {useUserStore} from '@/stores/user';

import axios from "axios";
import {apolloClient} from "../main";
import TagDetail from "@/components/TagDetail.vue";
import LoadingFillerBox from "@/components/LoadingFillerBox.vue";
import {useRestaurantStore} from "@/stores/restaurants";
import Map from "@/components/MapContainer.vue";


const LIKE_RESTAURANT = gql`
mutation Like($idrestaurant: Int){
    like(idrestaurant: $idrestaurant){
        idrestaurant
        url
        name
    }
}
`;

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

const DISLIKE_RESTAURANT = gql`
mutation Dislike($idrestaurant: Int){
    dislike(idrestaurant: $idrestaurant){
        idrestaurant
        url
        name
    }
}
`;


export default {
    components: {
        LoadingFillerBox,
        Menu,
        heart,
        TagDetail,
        Map
    },
    props: {
        name: String,
        url: String,
        idRestaurant: Number
    },
    setup(props) {
        const userStore = useUserStore();

        const restaurantStore = useRestaurantStore();


        const {loading, error, result} = useQuery(
            GET_RESTAURANT,
            () => ({
                url: props.url
            })
        )

        //const meals = computed(() => result.value?.restaurant.meals ?? []);


        const distance = computed(() => result.value?.restaurant.distance ?? null);


        return {
            restaurantStore,
            userStore,
            distance,
            loading
        }


    },
    name: "RestaurantCard",
    data() {
        return {
            meals: [],
            likeLoading: false
        }
    },
    methods: {
        getLink() {
            return '/restaurants/' + this.name;
        },
        isFavorite() {
            return this.userStore.getNames.includes(this.name);
        },
        isLikeLoading(){
            return this.likeLoading;
        },
        like() {
            this.likeLoading = true;
            console.log(this.likeLoading)
            apolloClient.mutate({
                mutation: LIKE_RESTAURANT,
                variables: {
                    idrestaurant: parseInt(this.idRestaurant)
                }
            }).then(restaurants => {
                this.likeLoading = false;
                console.log(this.likeLoading)

                this.userStore.setFavorites(restaurants.data.like);

            });
        },
        dislike() {
            apolloClient.mutate({
                mutation: DISLIKE_RESTAURANT,
                variables: {
                    idrestaurant: parseInt(this.idRestaurant)
                }
            }).then(restaurants => {
                this.userStore.setFavorites(restaurants.data.dislike);
            });
        }
    }

}
</script>

<style scoped lang="scss">

@keyframes like_animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes like_loading {
    0%{
        transform: rotate(0deg);
    }
    30%{
        transform: rotate(359deg);
    }
    60%{
        transform: rotate(0deg);
    }
}


.like-enter-active,
.like-leave-active {
  animation: ease 0.3s like_animation;

  svg {
    stroke: var(--color-text);

    path {
      fill: transparent;
    }

  }
}

.likeloading-enter-active,
.likeloading-leave-active {
  animation: ease 2s like_loading infinite;
}


.grow-enter-active,
.grow-leave-active {
  transition: transform 0.1s ease;
}

.grow-enter-from,
.grow-leave-to {
  transform-origin: center left;

  transform: scaleX(0);
}


.restaurant {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media screen and (max-width: 1000px) {
    flex-direction: column;
    width: 95vw;
  }

  .loading-box {

  }

  .loading-set {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  h3 {

    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;


    .loading-box {
      margin-bottom: 10px;

    }

    .heart-container {
      margin-left: 20px;
      display: flex;
      width: 20px;
      height: 20px;
    }

    a {
      color: var(--color-text);
      text-decoration: none;
      font-size: 25px;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }

    svg {
      position: absolute;
    }
  }

  .tags {
    flex: 100%;
    margin-bottom: 10px;


  }

  .no-menu {
    flex: 100%;
    margin-bottom: 10px;
    margin-top: 15px;
    color: var(--color-text);
    font-size: 20px;
    font-weight: 300;
  }

  .menu {
    flex: 1;
    @media screen and (max-width: 1000px) {
      width: 95vw;
    }
  }
}
</style>