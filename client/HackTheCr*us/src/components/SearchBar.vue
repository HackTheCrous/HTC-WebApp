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
        <div v-if="this.focused">
            <ul class="suggestions">
                <li v-for="restaurant in this.restaurants" :key="restaurant.url">
                    {{
                        restaurant.name
                    }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import {useLazyQuery} from "@vue/apollo-composable";
import gql from "graphql-tag";

const SEARCH_QUERY = gql`
    query Search {
    search(query: "frite") {
        url
        name
    }
}
`;


export default {
    name: "SearchBar.vue",
    props: {
        focused: Boolean
    },
    data(){
        return{
            queryValue: '',
            restaurants: []
        }
    },

    watch:{
      queryValue(newValue){
         if(newValue.length >=2){
             this.getRestaurants();
         }
      }
    },

    methods : {
        async getRestaurants(){
            await this.$apollo.searchRestaurants({
                variables: {
                    userQuery: this.queryValue,
                },
            });
        },
    },

    apollo: {
       searchRestaurants: {
           query: SEARCH_QUERY,
           variables() {
               return {
                   userQuery: this.queryValue,
               };
           },
           onCompleted(data){
               this.restaurants = data.search;
           },
           onError(error){
               console.error(error);
           },
           skip(){
               return this.queryValue.length <2;
           },
       },
    },

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
    .suggestions{
        margin-top:20px;
        margin-bottom:20px;
        border-top: solid 1px rgba(98, 86, 86, 0.74);
    }
}


</style>