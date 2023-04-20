<template>
    <div id="searchbar">
        <form>
            <input v-model="queryValue" type="text" placeholder="On mange quoi ?" name="search">
            <select name="filter">
                <option value="nearby">Proche</option>
                <option value="best">Mieux noté</option>
                <option value="alpha">Alphabétique</option>
            </select>
        </form>

        <ul v-if="this.focused && searchResults.length > 0" class="suggestions">
            <li v-for="result of searchResults" :key="result.restaurant.url">
                {{
                result.restaurant.name
                }}

                <ul >
                    <li v-for="food of result.meals">
                        {{ food.name.substring(0, food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()) - 1) }}
                        <b>{{
                            food.name.substring(food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()), food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()) + this.queryValue.length)
                            }}</b>{{
                        food.name.substring(food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()) + this.queryValue.length, food.name.length)
                        }} trouvable à {{ food.type }}
                    </li>
                </ul>

            </li>
        </ul>

    </div>
</template>

<script>

import {apolloClient} from "@/main";
import gql from "graphql-tag";

const GET_SEARCH_RESULT = gql`
query Search ($queryValue: String){
    search(query: $queryValue) {
        url
        name
        meals{
            foodies
        }
    }
}

`;

export default {

    name: "SearchBar.vue",
    props: {
        focused: Boolean
    },


    data() {
        return {
            queryValue: '',
            searchResults: []
        }
    },
    watch: {
        queryValue(newQuery) {
            this.searchResults = [];
            if (newQuery.length > 2) {
                apolloClient.query(({
                    query: GET_SEARCH_RESULT,
                    variables: {
                        queryValue: this.queryValue
                    }
                }))
                    .then((result) => {
                        this.searchResults = result.data.search.map((restaurant, index) => {
                            const menus = [];

                            //we select the correct menu here
                            for (const menu of restaurant.meals) {
                                for (const foodie of menu.foodies) {
                                    for (const meal of foodie.food) {
                                        if (meal.toUpperCase().includes(this.queryValue.toUpperCase())) {
                                            menus.push({name: meal, type: foodie.type});
                                        }
                                    }
                                }
                            }

                            return {
                                restaurant: {
                                    name: restaurant.name,
                                    url: restaurant.url
                                },
                                meals: menus
                            };
                        });
                    })
                    .catch(error => console.error(error))
            }

        }
    }
}
</script>

<style scoped lang="scss">
#searchbar {
  margin-left: 10%;
  width: -webkit-fill-available;
  margin-right: 10%;
  background: linear-gradient(180deg, rgba(241, 240, 240, 0.64) 100%, rgba(225, 225, 225, 0.64) 100%);
  display: flex;
  padding: 10px 20px;
  border-radius: 15px;
  flex-direction: column;
  margin-top: 20px;
  transition: all linear 0.4s;

  form {
    width: 100%;
    display: flex;
    flex-direction: row;

    input {
      width: 80%;

      background: transparent;
      font-family: Inter, sans-serif;
      border: 0px;

      &:active, &:focus {
        border: 0px;
      }
    }

    select {
      width: 20%;
      font-family: Inter, sans-serif;
      border: 0px;
      background: white;
      padding: 5px 20px;
      font-weight: 600;
      border-radius: 50px;
    }

  }

  .suggestions {
    margin-top: 20px;
    margin-bottom: 20px;
    max-height: 30vh;
    overflow-y: scroll;
  }

  b {
    font-weight: bold;
  }
}


</style>