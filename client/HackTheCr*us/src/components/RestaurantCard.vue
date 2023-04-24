<template>
    <div class="restaurant">
        <h3>
            <a :href="this.url">{{ this.name }}</a>
            <p></p>
        </h3>
        <Menu v-for="meal in this.meals" :name="meal.typemeal" :foodies="meal.foodies" :time="meal.day"></Menu>
    </div>
</template>


<script>
import {useQuery} from "@vue/apollo-composable";
import gql from "graphql-tag";
import {computed} from "vue";

import Menu from '@/components/Menu.vue';

export default {
    components: {
        Menu
    },
    props: {
        name: String,
        url: String
    },
    setup(props) {
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
                url : props.url
            })
        )

        const meals = computed(() => result.value?.restaurant.meals??[]);

        return {
            meals,
        }
    },
    name: "RestaurantCard",
    data() {
        return {
            meals: []
        }
    }

}
</script>

<style scoped lang="scss">
  .restaurant{
    border-bottom: 1px solid rgba(255, 255, 255, 0.55);
    padding-bottom: 20px;
    margin-bottom: 20px;
    h3{

      padding: 0;
      width:100%;
      margin: 0 0 10px;

      a{
        color: rgba(255, 255, 255, 0.71);
        text-decoration: none;
        font-size:25px;
        font-weight: 600;

        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
</style>