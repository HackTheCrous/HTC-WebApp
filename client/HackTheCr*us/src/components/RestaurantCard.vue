<template>
    <div class="restaurant">
        <h3>
            <router-link :to="getLink()">{{ this.name }}</router-link>
            <heart v-if="this.isFavorite()"  color="#24EE76" :filled="this.isFavorite()" size="20"/>
            <heart v-else color="#24EE76" @click="this.like()" :filled="this.isFavorite()" size="20"/>
            
        </h3>
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
import { apolloClient } from "../main";


const LIKE_RESTAURANT = gql`
mutation Like($idrestaurant: Int){
    like(idrestaurant: $idrestaurant){
        idrestaurant
        url
        name
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
        
        const {result} = useQuery(
        gql`
        query Restaurant($url: String){
            restaurant(url: $url){
                meals{
                    idmeal
                    typemeal
                    foodies
                    day
                }
                
            }
        }
        `,
        () => ({
            url: props.url
        })
        )
        
        const meals = computed(() => result.value?.restaurant.meals ?? []);
        
        return {
            meals,
            userStore
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
            return '/restaurant/'+this.name;
        },
        isFavorite(){
            const names = this.userStore.getFavorites.map(restaurant => restaurant.name);
            return names.includes(this.name);
        },
        like(){
            apolloClient.mutate({
                mutation: LIKE_RESTAURANT,
                variables: {
                    idrestaurant : parseInt(this.idRestaurant)
                }
            }).then(restaurant => {
                this.userStore.addFavorite(restaurant.like);
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
        margin: 0 0 10px;
        display :flex;
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
        svg{
            margin-left: 20px;
        }
    }
    
    .menu {
        flex: 1;
        
    }
}
</style>