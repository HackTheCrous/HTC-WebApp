<script>
import TagPlace from "@/components/TagPlace.vue";
import SearchBar from "@/components/SearchBar.vue";
import {useQuery} from "@vue/apollo-composable";
import {computed} from "vue";
import gql from "graphql-tag";
import RestaurantList from "@/components/RestaurantList.vue";
import Signout from "../assets/signout.vue";


export default {

  name: "Home",

  components: {
    Signout,
    SearchBar,
    TagPlace,
    RestaurantList
  },
  setup() {
    const {result} = useQuery(
        gql`query Restaurants{
    restaurants{
        idrestaurant
        url
        name
    }
}`
    );

    const restaurants = computed(() => {
      return result.value?.restaurants ?? []
    });

    return {
      restaurants,
    }
  },


  data() {
    return {
      tags: [{name: 'Tout'}, {name: 'Resto'}, {name: 'Cafet’'}, {name: 'Brasserie'}],
      focusedTag: 'Tout',
      username: 'Tristan',
      restaurants: [],
      focusSearch: false,
      keyPressed: [],
    }
  },
  mounted() {
    window.addEventListener('click', this.unfocusSearch)

    window.addEventListener('keydown', (e) => {
      const array = this.keyPressed;
      array.push(e.key);
      this.keyPressed = array;
    })

  },
  beforeDestroy() {
    window.removeEventListener('click', this.unfocusSearch);

    window.removeEventListener('keydown', (e) => {
      const array = this.keyPressed;
      array.push(e.key);
      this.keyPressed = array;
    })

  },
  methods: {
    unfocusSearch(e) {
      const searchbar = e.target.closest('#searchbar');
      if (!searchbar || !searchbar.contains(e.target)) {
        this.focusSearch = false;
      }
    }

  },
  watch: {
    keyPressed(newKeys) {
      console.log(newKeys);
    }
  }


}
</script>

<template>

  <header>
    <div id="infos">
      <h1>Hello {{ this.username }} ! 👋</h1>
      <h2>Crous · restaurants</h2>
    </div>
    <div id="sidetools">
      <SearchBar :focused="this.focusSearch" @click="this.focusSearch=true"/>
      <signout color="white" opacity="0.5"/>
    </div>
  </header>
  <div id="tags">
    <!--La façon dont le focus est gérée est dégueulasse-->
    <TagPlace v-for="tag in tags" :name="tag.name" :focused="this.focusedTag"
              @child-clicked="this.focusedTag=tag.name"
              :key="tag.name"/>
    <div class="filler"></div>
  </div>
  <main>

    <RestaurantList :restaurants="this.restaurants" :tag="focusedTag"/>
  </main>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;600&display=swap');

header {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  width: 100%;

}

main {


  h2 {
    font-family: Inter, sans-serif;
    font-size: 17px;
    font-weight: 200;
    color: rgba(255, 255, 255, 0.63);
    margin-top: 20Px;
    margin-bottom: 30Px;
  }
}

#sidetools {
  margin-top: 5px;

  display: flex;
  flex-direction: row;
  align-items: center;
}

#tags {
  display: flex;
  flex-direction: row;
  position: relative;
  z-index: 1;
  width: 100%;

  .filler {
    flex-grow: 1;
    border-bottom: solid 1px rgba(255, 255, 255, 0.42)

  }
}

#restaurants {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;

  .restaurant {
    width: 100%;
    padding-top: 20px;
  }
}


</style>
