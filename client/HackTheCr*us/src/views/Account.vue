<template>
    <header>
        <h1>Mon compte</h1>
    </header>
    <main>
        <form>
            <input type="text" v-model="username" placeholder="Nom"/>
            <input type="text" v-model="etablissement" placeholder="Etablissement"/>
            <div class="suggestions">
                <ul>
                    <li v-for="school in this.schoolSuggestions" @click="select" :id="school.idschool">{{ school.name }}</li>
                </ul>
            </div>
            <input type="text" v-model="ical" placeholder="Lien ical"/>
            <button @click="submit">Modifier</button>
        </form>
    </main>
</template>

<script>
import {useRestaurantStore} from "@/stores/restaurants";
import {useUserStore} from "@/stores/user";
import {apolloClient} from "@/main";
import gql from "graphql-tag";
import {useAlertsStore} from "@/stores/alerts";


const GET_SCHOOL_LIkE = gql`
query SearchSchool($queryValue: String){
    searchSchool(query: $queryValue) {
        idschool
        name
    }
}
`


const MODIFY_USER = gql`
mutation ModifyUserBySchoolName($name: String, $school: String, $ical: String) {
    modifyUserBySchoolName(name: $name, school: $school, ical: $ical) {
        iduser
    }
}
`

export default {
    name: "Account",
    setup() {
        const userStore = useUserStore();
        const restaurantStore = useRestaurantStore();
        const alerts = useAlertsStore();
        return {
            userStore, restaurantStore, alerts
        }
    },
    data() {
        return {
            username: this.userStore.getName,
            etablissement: this.userStore.getSchool === false ? '' : this.userStore.getSchool.name,
            ical: this.userStore.getIcal,
            schoolSuggestions: [],
            schoolData : {idSchool : 0, name : ''}
        }
    },
    methods: {
        async submit(e) {
            e.preventDefault();
            apolloClient.mutate({
                mutation: MODIFY_USER,
                variables: {
                    name: this.username,
                    school: this.schoolData.name,
                    ical: this.ical
                }
            }).then(() => {
                this.userStore.getData();
                this.restaurantStore.setRestaurants();
                this.alerts.addAlert({
                    message: 'Vos informations ont été modifiées !',
                    status: 'Success'
                });
            }).catch(err => {
                console.log(err);
                this.alerts.addAlert({
                    message: 'Une erreur est survenue ! ' + err,
                    status: 'Error'
                });
            })
        },
        getSuggestionsSchool(val) {
            apolloClient.query({
                query: GET_SCHOOL_LIkE,
                variables: {
                    queryValue: val
                }
            }).then((result) => {
                this.schoolSuggestions = result.data.searchSchool;
            })
        },
        select(e){
            console.log(e.target.id);
            this.schoolData.idSchool = e.target.id;
            this.schoolData.name = e.target.innerText;
            this.etablissement = e.target.innerText;
        }
    },
    watch: {
        etablissement(val) {
            this.getSuggestionsSchool(val);
        }
    }
}
</script>

<style scoped lang="scss">
header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}

main {
  form {
    display: flex;
    flex-direction: column;
    font-family: Inter, sans-serif;

      margin-top: 20px;
    input {
      margin: 10px 0;
      height: 40px;
        border:0;
        background: transparent;
      border-bottom: 1px solid var(--color-border);
      padding: 0 10px;
      width: 100%;
      font-size: 1.2rem;
    }

    button {
        cursor: pointer;
        font-family: Inter, sans-serif;
        width:fit-content;
        font-weight: 600;
        color: white;
        font-size: 16px;
        border: 0px;
        border-radius: 3px;
        padding: 5px 20px;
        background: #24EE76;
        box-shadow: 0px 4px 17px rgba(0, 0, 0, 0.08);
    }
  }
}

</style>
