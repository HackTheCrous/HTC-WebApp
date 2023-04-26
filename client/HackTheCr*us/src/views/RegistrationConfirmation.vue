<template>

    <main v-if="this.userStore.isLogged">
        <ProgessSteps :steps="steps" :current="this.currentStep"/>

        <form v-if="this.currentStep === 1 ">
            <div id="side">
                <p>{{ this.currentStep }} <b>-></b></p>
            </div>
            <div id="main">
                <h3>Quel est ton prénom ?</h3>
                <p class="sub">Ceci nous permettra de t’identifier sur l’application</p>
                <input type="text" v-model="name" placeholder="Entre ton prénom..."/>
                <span class="submitters">
                    <span>
                        <button @click="this.nextStep">Suivant</button>
                        <p>press <b>Enter ↵</b></p>

                    </span>



                </span>
            </div>
        </form>

        <form v-else-if="this.currentStep === 2 ">
            <div id="side">
                <p>{{ this.currentStep }} <b>-></b></p>
            </div>
            <div id="main">
                <h3>Où étudies-tu ?</h3>
                <p class="sub">Cette adresse te permettra de ne pas avoir à activer ta localisation</p>
                <input v-model="school" type="text" placeholder="Entre le nom de ton établissement..."/>
                <ul class="suggestions">
                    <li @click="this.setSchool" :id="school.idschool" v-for="school in this.schoolSuggestions">
                        {{ school.name }}
                    </li>
                    <li @click="this.addSchool">
                        + ajouter un établissement
                    </li>
                    <span class="submitters">
                        <br/>
                        <button class="skip" @click="this.goBack">Revenir</button>
                    </span>
                </ul>

            </div>
        </form>

        <form v-if="this.currentStep === 3 ">
            <div id="side">
                <p>{{ this.currentStep }} <b>-></b></p>
            </div>
            <div id="main">
                <h3>Entre ton lien ICal</h3>
                <p class="sub">Tu le trouveras sur <a
                        href="https://app.umontpellier.fr/prose-etudiant/protected/ical">Moodle</a></p>
                <input v-model="ical" type="text" placeholder="Colle ton lien ICal..."/>
                <span class="submitters">
                    <span>
                        <button @click="this.currentStep++">Suivant</button>
                        <p>press <b>Enter ↵</b></p>
                    </span>
                    <button @click="this.goBack" class="skip">Revenir</button>
                </span>
            </div>
        </form>
        <form v-if="this.currentStep === 4">
            <div id="side">
                <p>{{ this.currentStep }} <b>-></b></p>
            </div>
            <div id="main">
                <h3>Où manges-tu d'habitude ?</h3>
                <p class="sub">Si tu es fan du CROUS</p>
                <input v-model="restaurant" type="text" placeholder="Chercher un resto..."/>
                <span class="tags">
          <p class="tag" v-for="resto in this.restaurantSuggestions" @click="addRestaurant"
             :class="this.preferencesStore.containsRestaurant(resto.idrestaurant)"
             :id="resto.idrestaurant">{{ resto.name }}</p>
        </span>
                <span class="submitters">
                    <span>
                        <button @click="this.nextStep">Suivant</button>
                        <p>press <b>Enter ↵</b></p>
                    </span>
                    <button @click="this.goBack" class="skip">Revenir</button>
                </span>
            </div>
        </form>
    </main>
    <main v-else class="notLogged">
        <h2>500 - Authentication error</h2>
        <h1>Vous devez être connecté pour accéder à cette page</h1>
        <router-link to="/login/redirect">Se connecter</router-link>
    </main>
</template>

<script>
import ProgessSteps from "@/components/ProgessSteps.vue";
import {usePreferencesStore} from "../stores/preferences";
import {apolloClient} from "@/main";
import gql from "graphql-tag";
import {useUserStore} from "@/stores/user";


const GET_SEARCH_RESULT = gql`
query Search ($queryValue: String){
    searchRestaurant(query: $queryValue) {
        idrestaurant
        name
    }
}`

const GET_SCHOOL_LIkE = gql`
query SearchSchool($queryValue: String){
    searchSchool(query: $queryValue) {
        idschool
        name
    }
}
`

export default {
    name: "RegistrationConfirmation",
    components: {ProgessSteps},
    data() {
        return {
            steps: ['Inscription', 'Prénom', 'Etablissement', 'ICal', 'Préférences'],
            currentStep: 1,
            name: '',
            school: '',
            ical: '',
            restaurants: [],
            restaurant: '',
            restaurantSuggestions: [],
            schoolSuggestions: [],
        }
    },
    mounted() {
        this.getSuggestionsRestaurant('');
    },
    setup() {
        const preferencesStore = usePreferencesStore();
        const userStore = useUserStore();
        return {preferencesStore, userStore}
    },
    methods: {
        nextStep(e) {
            e.preventDefault();
            this.currentStep++;
        },
        goBack(e) {
            e.preventDefault();
            this.currentStep--;
        },
        setName(val) {
            this.preferencesStore.setName(val);
        },
        addSchool() {
            this.preferencesStore.setSchool(this.school);
            this.currentStep++;
        },
        setSchool(e) {
            e.preventDefault();
            this.preferencesStore.setSchool(e.target.id);
            this.currentStep++;
        },
        setICal(val) {
            this.preferencesStore.setIcalLink(val);
        },
        setRestaurants(val) {
            this.preferencesStore.setRestaurants(val);
        },
        addRestaurant(e) {
            console.log(e.target.id);
            this.preferencesStore.addRestaurant(e.target.id);
        },
        getSuggestionsRestaurant(val) {
            apolloClient.query({
                query: GET_SEARCH_RESULT,
                variables: {
                    queryValue: val
                }
            }).then((result) => {
                this.restaurantSuggestions = result.data.searchRestaurant;
            });
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
        }
    },
    watch: {
        name: function (val) {
            this.setName(val);
        },
        school: function (val) {
            this.getSuggestionsSchool(val);
        },
        ical: function (val) {
            this.setICal(val);
        },
        restaurants: function (val) {
            this.setRestaurants(val);
        },
        restaurant: function (val) {
            this.getSuggestionsRestaurant(val);
        },
        currentStep: function (val) {
            if (val === this.steps.length) {
                this.preferencesStore.savePreferences();
            }
        }
    }
}
</script>

<style scoped lang="scss">


main {
  height: 100vh;
  width: 100%;
  //background: linear-gradient(227.95deg, rgba(36, 238, 118, 0.3196) 17.63%, rgba(197, 255, 213, 0.0) 47.27%, rgba(197, 255, 213, 0.47) 80.86%) center;
  background-size: 200%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  form {
    width: 70%;
    display: flex;
    flex-direction: row;
    padding-bottom: 100px;

    #side {
      padding-top: 7px;
      padding-right: 10px;
      font-size: 20px;

      b {
        font-weight: 600;
      }
    }

    #main {
      width: 90%;

      h3 {
        font-weight: 600;
        font-size: 30px;

        &:before {
          content: attr(id);
          font-size: 20px;

        }
      }

      .suggestions {
        list-style: none;
        padding: 0;
        margin: 0;
        position: absolute;
        width: 100%;
        button{
            margin-top: 10px;
        }
        li {
          font-size: 20px;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-border);

          &:hover {
            background: var(--color-border);
            cursor: pointer;
          }

          &:last-of-type {
            color: #24EE76;
            border-bottom: 1px solid #24EE76;
          }
        }
      }

      .tags {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 20px;

        .tag {
          background: transparent;
          border-radius: 100px;
          border: 1px solid var(--color-text);
          color: var(--color-text);
          padding: 5px 10px;
          margin-right: 10px;
          margin-bottom: 10px;

          &.selected {
            background: #24EE76;
            border: 1px solid #24EE76;
            color: white;
          }
        }
      }

      .submitters {

        display: flex;
        width: 100%;
        justify-content: space-between;
        flex-direction: row;

        span {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          p {
            margin-left: 15px;

            b {
              font-weight: 600;
            }
          }
        }

        button {
          font-family: Inter, sans-serif;
          font-weight: 600;
          color: white;
          font-size: 16px;
          border: 0px;
          border-radius: 3px;
          padding: 5px 20px;
          background: #24EE76;
          box-shadow: 0px 4px 17px rgba(0, 0, 0, 0.08);

          &.skip {
            background: #CFCFCF;
          }
        }
      }

      .sub {
        transform: translateY(-10px);
        font-size: 20px;

        a {
          color: #24EE76;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }

          &:visited {
            color: #24EE76;
          }
        }
      }

      input {
        font-size: 35px;
        font-family: Inter, sans-serif;
        width: 100%;
        border: 0;
        border-bottom: 1px solid var(--color-border);
        background: transparent;
        padding: 0;

        color: rgba(0, 0, 0, 0.42);
        margin: 0 0 15px;

        &:focus {
          outline: none;
          border-bottom: 1px solid var(--color-text);
          color: var(--color-text);
        }
      }
    }


  }

  &.notLogged {
    h2 {
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 30px;
      margin-bottom: 20px;
    }

    a {
      font-size: 20px;
      margin-bottom: 20px;
      color: #24EE76;
    }
  }
}

</style>