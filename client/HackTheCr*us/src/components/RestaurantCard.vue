<template>
    <div class="restaurant">
        <h3>
            <router-link :to="getLink()">{{ this.name }}</router-link>
            <heart v-if="this.isFavorite()" @click="this.dislike()" color="#24EE76" :filled="this.isFavorite()"
                   size="20"/>
            <heart v-else color="#24EE76" @click="this.like()" :filled="this.isFavorite()" size="20"/>
        </h3>
        <div class="tags">
            <p v-if="this.distance != null">{{ Math.round(this.distance / 10) / 100 }}km</p>
        </div>
        <Menu v-for="meal in this.meals" :name="meal.typemeal" :foodies="meal.foodies" :time="meal.day"
              class="menu"></Menu>
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

const GET_RESTAURANT_AND_DISTANCE = gql`
query Restaurant($url: String, $idschool: Int){
    restaurant(url: $url, idschool: $idschool){
        distance
        meals{
            idmeal
            typemeal
            foodies
            day
        }
    }

}
`;

export default {
    components: {
        Menu,
        heart
    },
    props: {
        name: String,
        url: String,
        idRestaurant: Number
    },
    setup(props) {
        const userStore = useUserStore();

        if (userStore.getSchool !== false) {
            console.log("GETTING DISTANCE")
            const {result} = useQuery(
                GET_RESTAURANT_AND_DISTANCE,
                () => ({
                    url: props.url,
                    idschool: userStore.getSchool.idschool
                })
            )

            const meals = computed(() => result.value?.restaurant.meals ?? []);

            const distance = computed(() => result.value?.restaurant.distance ?? 0);
            return {
                meals,
                userStore,
                distance
            }
        }



        const {result} = useQuery(
            GET_RESTAURANT,
            () => ({
                url: props.url
            })
        )

        const meals = computed(() => result.value?.restaurant.meals ?? []);

        return {
            meals,
            userStore,
            distance: null
        }
    },
    name: "RestaurantCard",
    data() {
        return {
            meals: []
        }
    },
    methods: {
        getLink() {
            return '/restaurant/' + this.name;
        },
        isFavorite() {
            return this.userStore.getNames.includes(this.name);
        },
        like() {
            apolloClient.mutate({
                mutation: LIKE_RESTAURANT,
                variables: {
                    idrestaurant: parseInt(this.idRestaurant)
                }
            }).then(restaurants => {
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
.restaurant {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  h3 {

    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

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
      margin-left: 20px;
    }
  }

  .tags {
      flex:100%;
      margin-bottom:10px;
    p {
      border-radius: 30px;
      border: 1px var(--color-text) solid;
        opacity: 0.8;
        background-color:var(--color-text);
        width:fit-content;
        font-size: 12px;
        padding: 2px 7px;
        color:var(--color-background-soft);
    }
  }

  .menu {
    flex: 1;

  }
}
</style>