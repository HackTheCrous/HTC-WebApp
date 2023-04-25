<script>
import TagPlace from "@/components/TagPlace.vue";
import SearchBar from "@/components/SearchBar.vue";
import {useQuery} from "@vue/apollo-composable";
import {computed} from "vue";
import gql from "graphql-tag";
import RestaurantList from "@/components/RestaurantList.vue";
import Signout from "../assets/signout.vue";
import {useUserStore} from "@/stores/user";
import axios from "axios";
import {useAlertsStore} from "@/stores/alerts";
import LoginBanner from "@/components/LoginBanner.vue";


export default {

    name: "Home",

    components: {
        LoginBanner,
        Signout,
        SearchBar,
        TagPlace,
        RestaurantList
    },
    setup() {

        const userStore = useUserStore();

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

        const alerts = useAlertsStore();

        return {
            restaurants, userStore,alerts
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
        document.addEventListener('click', this.unfocusSearch)

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Control' && this.keyPressed.includes('k') || e.key === 'k' && this.keyPressed.includes('Control')) {
                e.preventDefault();
            }
            this.keyPressed = this.keyPressed.concat(e.key);
        })

        document.addEventListener('keyup', (e) => {
            e.preventDefault();
            this.keyPressed = this.keyPressed.filter((key) => key !== e.key);
        });

    },
    beforeDestroy() {
        document.removeEventListener('click', this.unfocusSearch);

        document.removeEventListener('keydown', (e) => {
            e.preventDefault();
            this.keyPressed = this.keyPressed.concat(e.key)
        })

        document.removeEventListener('keyup', (e) => {
            e.preventDefault();
            this.keyPressed = this.keyPressed.filter((key) => key !== e.key);
        });

    },
    methods: {
        unfocusSearch(e) {
            const searchbar = e.target.closest('#searchbar');
            if (!searchbar || !searchbar.contains(e.target)) {
                this.focusSearch = false;
            }
        },
        logout() {
            axios.post('http://localhost:4000/logout', {}, {
                headers: axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.userStore.token
            }).then(res => {
                console.log(res);
                this.userStore.logout();
                this.$router.push('/login');
                this.alerts.addAlert({message: 'Vous êtes déconnecté !', status: 'Success'});
            }).catch(err => {
                this.userStore.logout();
                this.alerts.addAlert({message: err.response.data, status: 'Error'});
                console.log("ERR" + err);
            });
        }

    },
    watch: {
        keyPressed(newKeys) {
            if (newKeys.includes('Control') && newKeys.includes('k')) {
                this.focusSearch = true;
                this.keyPressed = [];
            }
            if (newKeys.includes('Escape')) {
                this.focusSearch = false;
                this.keyPressed = [];
            }

        }
    }


}
</script>

<template>
    <div v-if="!this.userStore.logged">
        <header class="blurred">
            <div id="infos">
                <h2>Crous · restaurants</h2>
            </div>
            <div id="sidetools">
                <SearchBar :focused="this.focusSearch" @click="this.focusSearch=true"/>
                <signout color="grey" opacity="0.5" @click="this.logout"/>
            </div>
        </header>
        <div id="tags" class="blurred">
            <!--La façon dont le focus est gérée est dégueulasse-->
            <TagPlace v-for="tag in tags" :name="tag.name" :focused="this.focusedTag"
                      @child-clicked="this.focusedTag=tag.name"
                      :key="tag.name"/>
            <div class="filler"></div>
        </div>
        <main class="blurred">

            <RestaurantList :restaurants="this.restaurants" :tag="focusedTag"/>
        </main>
        <LoginBanner/>

    </div>
    <div v-else>
        <header >
            <div id="infos">
                <h1>Hello {{ this.userStore.getName }} ! 👋</h1>
                <h2>Crous · restaurants</h2>
            </div>
            <div id="sidetools">
                <SearchBar :focused="this.focusSearch" @click="this.focusSearch=true"/>
                <signout color="grey" opacity="0.5" @click="this.logout"/>
            </div>
        </header>
        <div id="tags">
            <!--La façon dont le focus est gérée est dégueulasse-->
            <TagPlace v-for="tag in tags" :name="tag.name" :focused="this.focusedTag"
                      @child-clicked="this.focusedTag=tag.name"
                      :key="tag.name"/>
            <div class="filler"></div>
        </div>
        <main >

            <RestaurantList :restaurants="this.restaurants" :tag="focusedTag"/>
        </main>
    </div>
</template>

<style lang="scss">


@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;600&display=swap');

.blurred{
  filter: blur(4px);
}

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
    color: var(--color-text);
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
    border-bottom: solid 1px var(--color-border);

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
