<template>
    <h2>{{ this.name }}</h2>
    <div id="meals">
        <div v-for="meal in this.meals" class="meal">
            <h3>{{ meal.typemeal }}</h3>
            <div v-for="foody in meal.foodies">
                <h4>{{ foody.type }}</h4>
                <div v-for="food in foody.food">
                    {{ food }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {computed} from "vue";
import {useQuery} from "@vue/apollo-composable";
import gql from "graphql-tag";
import {apolloClient} from "@/main";

const GET_RESTAURANT_BY_NAME = gql`
    query Restaurant($id: String){
        restaurant(url: $id){
            idrestaurant
            url
            name
            meals{
                typemeal
                foodies
                day
            }
        }
    }
`;


export default {
    name: "RestaurantDetail",
    data() {
        return {
            id: this.$route.params.id,
            name: '',
            url: '',
            meals: []
        }
    },
    mounted() {
        apolloClient.query(({
            query: GET_RESTAURANT_BY_NAME,
            variables: {
                id: this.id
            }
        })).then((result) => {
            this.name = result.data.restaurant.name;
            this.url = result.data.restaurant.url;
            this.meals = result.data.restaurant.meals;
        })
    },
}
</script>

<style lang="scss" scoped>
h2{
    font-size: 2rem;
}
#meals{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .meal {
        width:50%;
    }

    h3{
        margin: 0 0 10px;
    }
}

</style>