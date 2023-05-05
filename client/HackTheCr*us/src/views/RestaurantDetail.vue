<template>
    <h2>{{ this.name }}</h2>
    <h2 v-if="loading">
        <LoadingFillerBox height="40px" width="30%"></LoadingFillerBox>
    </h2>
    <div id="tags">
        <TagDetail v-if="this.distance !== 0"> {{ Math.round(this.distance / 10) / 100 }}km</TagDetail>
    </div>
    <hr/>

    <LoadingFillerBox v-if="loading" height="400px" width="100%"></LoadingFillerBox>

    <h2>{{ this.day }}</h2>

    <div id="meals">

        <div v-for="meal in this.meals" class="meal">
            <h3>{{ meal.typemeal }}</h3>
            <div v-for="foody in meal.foodies">
                <h4>{{ foody.type }}</h4>
                <div v-for="food in foody.food" class="food">
                    {{ food }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import gql from "graphql-tag";
import {apolloClient} from "@/main";
import TagDetail from "@/components/TagDetail.vue";
import LoadingFillerBox from "@/components/LoadingFillerBox.vue";

const GET_RESTAURANT_BY_NAME = gql`
    query Restaurant($id: String){
        restaurant(url: $id){
            idrestaurant
            url
            name
            distance
            coords {
                x
                y
            }
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
    components: {LoadingFillerBox, TagDetail},
    data() {
        return {
            id: this.$route.params.id,
            name: '',
            url: '',
            meals: [],
            distance: 0,
            coords: {
                x: 0,
                y: 0
            },
            day: '',
            loading: false
        }
    },
    mounted() {
        this.loading = true;
        apolloClient.query(({
            query: GET_RESTAURANT_BY_NAME,
            variables: {
                id: this.id
            }
        })).then((result) => {
            this.name = result.data.restaurant.name;
            this.url = result.data.restaurant.url;
            this.meals = result.data.restaurant.meals;
            this.distance = result.data.restaurant.distance;
            this.coords = result.data.restaurant.coords;

            const dateFormat = new Date(parseInt(this.meals[0].day));

            const formated = dateFormat.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            this.day = formated.charAt(0).toUpperCase() + formated.slice(1);

            this.loading = false;
        })
    },
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 2rem;
  margin: 10px 0 0px;

  &:last-of-type {
    font-size: 1.5rem;
  }
}

hr {
  border: 1px solid var(--color-border);
  margin-bottom: 20px;

}

#tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

#meals {
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
  flex-wrap: wrap;

  h4 {
    font-style: italic;
  }

  .meal {
    width: 50%;
    @media screen and (max-width: 1000px) {
      width: 100%;
    }

    .food {
      margin-left: 15px;
    }
  }

  h3 {
    margin: 0 0 10px;
  }


}

</style>