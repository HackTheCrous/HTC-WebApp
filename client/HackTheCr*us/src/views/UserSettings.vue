<template>
  <h1>Paramètres personnels</h1>
  <SettingField :regex="/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,30}$/" placeholder="Entre ton nom" @send="updateName">
    <template v-slot:title>
      Ton nom d'utilisateur
    </template>
    <template v-slot:label>
      Ce nom permet de t'identifier sur l'application !
    </template>
    <template v-slot:hint>
      Ne choisis pas un nom avec plus de 48 caractères.
    </template>
  </SettingField>

  <SettingField :regex="/^(https:\/\/proseconsult\.umontpellier\.fr\/)/" placeholder="Entre ton lien Ical" @send="updateIcal" long>
    <template v-slot:title>
      Ton lien Ical
    </template>
    <template v-slot:label>
      Ce lien nous permet de récupérer ton emploi du temps. Si il n’est pas précisé on ne pourra pas te le fournir.
      Pour le récupérer <a href="https://app.umontpellier.fr/prose-etudiant/protected/ical" target="_blank">clique ici
      !</a>
    </template>
    <template v-slot:hint>
      Les liens ne commençant pas par <b>https://proseconsult.umontpellier.fr</b> ne sont pas accepté.
    </template>
  </SettingField>

  <SettingField :regex="/^(.)/" @send="updateSchool" @input="searchSchool" placeholder="Cherche un établissement" :suggestions="suggestions">
    <template v-slot:title>
      Ton établissement
    </template>
    <template v-slot:label>
      Choisis un établissement parmi la liste suivante :
    </template>
    <template v-slot:hint>
      Indiquer ton établissement nous permet de ne pas avoir besoin de te géolocaliser pour te recommander des
      restaurants.
    </template>
  </SettingField>

  <SettingField placeholder="Entre ton mail étudiant" warning>
    <template v-slot:title>
      Supprimer ton compte
    </template>
    <template v-slot:label>
      C’est ici que nos chemins se séparent... Cette action est irréversible et tu le sais ! Mais certaines fois, finir
      une relation est la meilleure décision à prendre. Espérant qu’Hack The Crous t’aura plu.
    </template>
    <template v-slot:hint>
      Il est encore temps de ne pas faire une bêtise !
    </template>
  </SettingField>
</template>

<script>
import SettingField from "@/components/SettingField.vue";
import gql from "graphql-tag";
import {apolloClient} from "../main";
import {useUserStore} from "../stores/user";
import {useLoadingStore} from "../stores/loadingStore";
import {useAlertsStore} from "../stores/alerts";

const SEARCH_SCHOOL = gql`
  query SearchSchool($name: String!){
    searchSchool(query: $name){
      name
    }
  }
`;

export default {
  components: {SettingField},
  data() {
    return {
      suggestions: this.searchSchool(""),
    }
  },
  setup() {
    const userStore = useUserStore();
    const loadingStore = useLoadingStore();
    const alertStore = useAlertsStore();
    return {
      userStore,
      loadingStore,
      alertStore
    }
  },
  methods: {
    async searchSchool(name) {
      const {data} = await apolloClient.query({
        query: SEARCH_SCHOOL,
        variables: {
          name
        }
      });
      this.suggestions = data.searchSchool.map(school => school.name);
    },
    updateName(name) {
      this.loadingStore.startLoading();
      apolloClient.mutate({
        mutation: gql`
          mutation UpdateName($name: String!){
            modifyUserField(name: $name){
              name
            }
          }
        `,
        variables: {
          name
        }
      }).then(({data}) => {
        console.log(data);
        this.userStore.setName(data.modifyUserField.name);
        this.loadingStore.stopLoading();
        this.alertStore.addAlert({
          status: "Success",
          message: "Ton nom a bien été mis à jour !"
        })
      }).catch(err => {
        this.loadingStore.stopLoading();
        this.alertStore.addAlert({
          status: "Error",
          message: "Une erreur est survenue lors de la mise à jour de ton nom ! " + err
        })
        console.log(err);
      })
    },
    updateIcal(ical){
      this.loadingStore.startLoading();
      apolloClient.mutate({
        mutation: gql`
          mutation UpdateIcal($ical: String!){
            modifyUserField(ical: $ical){
              ical
            }
          }
        `,
        variables: {
          ical
        }
      }).then(({data}) => {
        this.loadingStore.stopLoading();
        console.log(data);
        this.userStore.setIcal(data.modifyUserField.ical);
        this.alertStore.addAlert({
          status: "Success",
          message: "Ton emploi du temps a bien été mis à jour !"
        })
      }).catch(err => {
        this.loadingStore.stopLoading();
        console.log(err);
      })
    },
    updateSchool(school){
      this.loadingStore.startLoading();
      console.log(school);
      apolloClient.mutate({
        mutation: gql`
          mutation UpdateSchool($school: String!){
            modifyUserField(school: $school){
              iduser
              name
              school{
                idschool
                name
              }
            }
          }
        `,
        variables: {
          school
        }
      }).then(({data}) => {
        this.loadingStore.stopLoading();
        console.log(data);
        this.userStore.setSchool(data.modifyUserField.school);
        this.alertStore.addAlert({
          status: "Success",
          message: "Ton établissement a bien été mis à jour !"
        })
      }).catch(err => {
        this.loadingStore.stopLoading();
        console.log(err);
      })
    },

  }

}
</script>

<style scoped lang="scss">
b {
  font-weight: 500;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.setting-field {
  margin-bottom: 50px;
}
</style>