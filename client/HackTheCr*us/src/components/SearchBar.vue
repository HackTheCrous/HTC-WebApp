<template>
    <div :class="this.focused ? 'focused container' : 'unfocused'">
        <div id="searchbar">
            <form>
                <search color="black" opacity="0.5"/>
                <input v-model="queryValue" ref="textinput" type="text" placeholder="On mange quoi ?" name="search">
                <p class="shortcut" v-if="focused">Esc</p>
                <p class="shortcut" v-else>Ctrl+k</p>

            </form>

            <ul v-if="searchResults.length > 0" class="suggestions">
                <li v-for="result of searchResults" :key="result.restaurant.url" class="suggestion">
          <span class="head">
            <h4>
          {{
                result.restaurant.name
                }}
          </h4>
            <router-link :to="`/restaurant/${result.restaurant.name}`">
              Voir le menu <b>></b>
            </router-link>
          </span>
                    <ul>
                        <!--<li v-for="food of result.meals">
                            {{
                            food.name.substring(0, food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()) - 1)
                            }}
                            <b>{{
                                food.name.substring(food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()), food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()) + this.queryValue.length)
                                }}</b>{{
                            food.name.substring(food.name.toUpperCase().indexOf(this.queryValue.toUpperCase()) + this.queryValue.length, food.name.length)
                            }} trouvable à {{ food.type }}
                        </li>-->
                        <li><TagDetail>{{ result.food.category }}</TagDetail> {{ result.food.name }} durant le {{ result.food.period }} </li>
                    </ul>

                </li>
            </ul>
            <ul class="suggestions" v-else-if="this.loading">
                <li class="suggestion">
                  <span class="head">
                      <LoadingFillerBox height="25px" width="40%"></LoadingFillerBox>
                      <LoadingFillerBox height="25px" width="20%"></LoadingFillerBox>
                  </span>
                    <ul>
                        <li>
                            <LoadingFillerBox height="70px" width="100%"></LoadingFillerBox>
                        </li>
                    </ul>
                </li>
            </ul>

        </div>
    </div>


</template>

<script>

import {apolloClient} from "@/main";
import gql from "graphql-tag";
import Search from "../assets/search.vue";
import LoadingFillerBox from "@/components/LoadingFillerBox.vue";
import StringUtils from "@/utils/StringUtils";
import TagDetail from "@/components/TagDetail.vue";

const GET_SEARCH_RESULT = gql`
query Search ($queryValue: String){
    searchFood(query: $queryValue) {
        url
        name
        food {
            name
            category
            period
        }
    }
}

`;

export default {

    name: "SearchBar.vue",
    components: {TagDetail, LoadingFillerBox, Search},
    props: {
        focused: Boolean
    },

    data() {
        return {
            queryValue: '',
            searchResults: [],
            loading: false
        }
    },
    watch: {
        focused(newVal) {
            if (newVal) {
                this.$refs.textinput.focus();
            }
        },

        queryValue(newQuery) {
            this.searchResults = [];
            if (newQuery.length > 2) {
                this.loading = true;
                apolloClient.query(({
                    query: GET_SEARCH_RESULT,
                    variables: {
                        queryValue: this.queryValue
                    }
                }))
                    .then((result) => {
                        this.searchResults = result.data.searchFood.map((restaurant, index) => {


                            this.loading = false;
                            return {
                                restaurant: {
                                    name: restaurant.name,
                                    url: restaurant.url
                                },
                                food: restaurant.food
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
  transition: all 0.1s ease;


  width: 300px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  background: linear-gradient(180deg, rgba(241, 240, 240, 0.64) 100%, rgba(225, 225, 225, 0.64) 100%);
  display: flex;
  padding: 7px 10px;
  border-radius: 10px;
  margin-right: 15px;
  flex-direction: column;


  form {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      margin-right: 5px;
    }

    input {
      width: 70%;
      font-size: 12px;
      background: transparent;
      font-family: Inter, sans-serif;
      border: 0px;

      &:active, &:focus {
        border: 0px;
      }
    }

    p {
      margin-left: 25px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }

    select {
      width: 30%;

      font-family: Inter, sans-serif;
      border: 0px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 15px;
      font-weight: 600;
      border-radius: 50px;
      margin-left: 10px;
    }

  }


  b {
    font-weight: bold;
    color: #53e78a;
  }


}

.unfocused {
  .suggestions {
    display: none;
  }
}

.container {
  position: fixed;
  z-index: 4;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: rgba(58, 55, 55, 0.5);
  backdrop-filter: blur(3px);
  padding-top: 30px;
  padding-bottom: 30px;

  #searchbar {
    width: 50%;
    @media screen and (max-width: 1000px) {
      width: 90%;
    }
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background: white;
    height: fit-content;

    form {
      background: rgba(0, 0, 0, 0.1);
      padding: 5px 10px;
      border-radius: 10px;
    }

    .suggestions {
      margin-top: 20px;
      margin-bottom: 20px;
      max-height: 90vh;
      @media screen and (max-width: 1000px) {
        max-height: 70vh;
      }
      overflow-y: scroll;
      color: black;
      margin-left: 0px;
      padding-left: 0px;

      ul {
        margin-left: 0px;
        padding-left: 0px;
        list-style: none;
      }

      .head {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: center;

        h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        a {
          font-size: 12px;
          color: #53e78a;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .suggestion {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        li {
          font-size: 14px;
          margin-bottom: 5px;
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }

  }
}


</style>