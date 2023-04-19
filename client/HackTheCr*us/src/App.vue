
<script>
import TagPlace from "@/components/TagPlace.vue";
import SearchBar from "@/components/SearchBar.vue";
import RestaurantCard from "@/components/RestaurantCard.vue";
import {DefaultApolloClient, useQuery} from "@vue/apollo-composable";
import {computed} from "vue";
import gql from "graphql-tag";
import RestaurantList from "@/components/RestaurantList.vue";
import searchBar from "@/components/SearchBar.vue";
export default {
    computed: {
        searchBar() {
            return searchBar
        }
    },
    components: {
        SearchBar,
        TagPlace,
        RestaurantList
    },
    setup(){
        const {result} = useQuery(
            gql`
            query Restaurants{
                restaurants{
                    idrestaurant
                    url
                    name
                }
            }`
        )

        const restaurants  = computed(() => {
            return result.value?.restaurants ?? []
        });

        return{
            restaurants,
        }
    },


    data() {
        return {
            tags: [{name: 'Tout'}, {name: 'Resto'}, {name: 'Cafet’'}, {name: 'Brasserie'}],
            focusedTag: 'Tout',
            username: 'Tristan',
            restaurants: [],
            focusSearch: false
        }
    },
    mounted(){
        window.addEventListener('click', this.unfocusSearch)
    },
    beforeDestroy() {
        window.removeEventListener('click', this.unfocusSearch);
    },
    methods: {
       unfocusSearch(e){
           const searchbar = e.target.closest('#searchbar');
            if(!searchbar || !searchbar.contains(e.target)){
                this.focusSearch = false;
            }
       }

    },


}
</script>

<template>
    <header>
        <div id="tags">
            <!--La façon dont le focus est gérée est dégueulasse-->
            <TagPlace v-for="tag in tags" :name="tag.name" :focused="this.focusedTag"
                      @child-clicked="this.focusedTag=tag.name"
                      :key="tag.name"/>
        </div>
        <SearchBar :focused="this.focusSearch" @click="this.focusSearch=true"/>
    </header>
    <main>
        <h2>Hello {{ this.username }} ! 👋</h2>
        <RestaurantList :restaurants="this.restaurants" :tag="focusedTag"/>
    </main>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;600&display=swap');

header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

main {
    padding-top: 30px;
    margin-left: 10%;
    margin-right: 10%;

    h2 {
        font-family: Inter, sans-serif;
        font-weight: 600;
    }
}

#tags {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 40%;
    margin-top: 30px;
}

#restaurants{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap:wrap;
    .restaurant {
        width:45%;
        padding-top:20px;
    }
}


</style>
