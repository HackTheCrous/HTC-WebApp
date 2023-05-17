<template>
  <div class="restaurant">
    <h3 ref="title">
      <router-link :to="getLink()" v-if="!this.isLoading()">{{ this.name }}</router-link>
      <LoadingFillerBox width="30%" height="30px" v-if="this.loading"/>
      <span class="heart-container">
                <Transition name="likeloading">
                    <heart v-if="this.isLikeLoading()" color="#ff0000"
                           :filled="this.isFavorite()" size="20"/>
                </Transition>

                <Transition name="loading">
                    <heart v-if="!(this.isFavorite() && !this.isLoading() && !this.isLikeLoading())" color="#24EE76"
                           @click="this.like()"
                           :filled="this.isFavorite()" size="20"/>
                </Transition>

                <Transition name="like">
                    <heart v-if="this.isFavorite() && !this.isLoading() && !this.isLikeLoading()" @click="this.dislike()"
                           color="#24EE76"
                           :filled="this.isFavorite()"
                           size="20"/>
                </Transition>

            </span>

    </h3>
    <Transition name="grow">
      <div class="loading-set" v-if="this.isLoading()">
        <LoadingFillerBox width="49%" height="100px"/>
        <LoadingFillerBox width="49%" height="100px"/>
      </div>
    </Transition>
    <div class="tags" v-if="!this.isLoading()">
      <TagDetail v-if="this.restaurantStore.getDistance(this.url) !== 0"> {{ Math.round(this.restaurantStore.getDistance(this.url) / 10) / 100 }}km</TagDetail>
    </div>
    <div v-if="this.hasBeenViewed">
      <Menu v-for="meal in this.getMeal()" :key="meal.typemeal" :name="meal.typemeal"
            :foodies="meal.foodies"
            :time="meal.day"
            class="menu">
      </Menu>
    </div>
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
    idRestaurant: Number,
    preload: Boolean
  },
  setup(props) {
    const userStore = useUserStore();
    const restaurantStore = useRestaurantStore();
    return {
      restaurantStore,
      userStore,
    }
  },
  name: "RestaurantCard",
  data() {
    return {
      meals: [],
      likeLoading: false,
      viewed: 0,
      loading: false
    }
  },
  mounted() {

    let options = {
      root: this.$el.$parent,
      rootMargin: "0px",
      threshold:1.0,
    };

    let observer = new IntersectionObserver(() => {
      if(this.viewed<2){
        this.viewed++;
      }else{
        observer.unobserve(this.$refs.title);
      }
    },options);

    observer.observe(this.$refs.title);
  },
  methods: {
    getLink() {
      return '/restaurants/' + this.name;
    },
    isFavorite() {
      return this.userStore.getNames.includes(this.name);
    },
    isLikeLoading() {
      return this.likeLoading;
    },
    isLoading(){
      return this.loading;
    },
    getMeal() {
      return this.meals;
    },
    setMeals(meals) {
      this.meals = meals;
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
    },
  },
  computed:{
    hasBeenViewed(){
      if(this.viewed>1 ||this.preload){
        this.loading = true;
        this.restaurantStore.setMeal(this.url).then((meals)=>{
          this.loading = false;
          this.setMeals(meals);
        });
      }
      return this.viewed>1 ||this.preload;
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
  0% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(360deg);
  }

  80% {
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