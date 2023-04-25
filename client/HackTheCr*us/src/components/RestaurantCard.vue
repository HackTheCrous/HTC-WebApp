<template>
    <div class="restaurant">
        <h3>
            <router-link :to="getLink()">{{ this.name }}</router-link>
            <p></p>
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
                url: props.url
            })
        )

        const meals = computed(() => result.value?.restaurant.meals ?? []);

        return {
            meals,
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

    a {
      color: var(--color-text);
      text-decoration: none;
      font-size: 25px;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .menu {
    flex: 1;
   
  }
}
</style>