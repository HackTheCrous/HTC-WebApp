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
    <MapContainer v-if="!loading" :key="this.coords.x" :x="this.coords.x" :y="this.coords.y" />

</template>

<script>

import gql from "graphql-tag";
import {apolloClient} from "@/main";
import TagDetail from "@/components/TagDetail.vue";
import MapContainer from "@/components/MapContainer.vue";
import LoadingFillerBox from "@/components/LoadingFillerBox.vue";
import {useRestaurantStore} from "../stores/restaurants";

export default {
    name: "RestaurantDetail",
    components: {LoadingFillerBox, TagDetail, MapContainer},
    emits : ['update'],

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
    setup(){
      const restaurantStore = useRestaurantStore();
      return {
          restaurantStore
      }
    },
    mounted() {
        this.update();
    },
    watch: {
        $route(to, from) {
            this.id = to.params.id;
            this.update();
            this.$emit('update');
        }
    },
    methods:{
        async update(){
            this.loading = true;
            const restaurantData = this.restaurantStore.getRestaurant(this.id);
            if(restaurantData) {
              this.name = restaurantData.name;
              this.url = restaurantData.url;
              this.meals = restaurantData.meal;
              this.distance = restaurantData.distance;
              this.coords = {
                x : restaurantData.coords.x,
                y : restaurantData.coords.y
              };

              console.log(this.coords);
              this.day = restaurantData.day;
              this.loading = false;
            }else{
              await this.restaurantStore.setRestaurant(this.id);
             this.loading = false;
             update() // warning !! recursive call;
            }

        }
    }
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
    margin-bottom: 20px;
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
