<template>
  <main>
    <ProgessSteps :steps="steps" :current="currentStep" />
    <ConfirmationQuestion
      step="1"
      v-if="currentStep === 0"
      :current="currentStep + 1"
      :max="steps.length"
      @next="confirmMail"
      @previous="previous"
      :value="entries.mail"
      :regex="/^.*@etu\.umontpellier\.fr$/"
    >
      <ConfirmationTextField>
        <template v-slot:title> Quel est ton mail <u>étudiant</u> ? </template>
        <template v-slot:legend>
          Ceci nous permettra de t’identifier sur l’application et de vérifier
          que tu es bien à la fac. ⚠️ Ton adresse mail doit terminer par
          @etu.umontpellier.fr !
        </template>
        <template v-slot:input>
          <input
            type="text"
            placeholder="Entre ton mail étudiant..."
            pattern="^.*@etu\.umontpellier\.fr"
            v-model="entries.mail"
          />
        </template>
      </ConfirmationTextField>
    </ConfirmationQuestion>
    <ConfirmationQuestion
      step="1"
      v-if="currentStep === 0.5"
      :current="currentStep + 1"
      :max="steps.length"
      @next="confirmCode"
      @previous="previous"
    >
      <ConfirmationTextField v-if="currentStep === 0.5">
        <template v-slot:title
          >On a envoyé un code de confirmation à ton mail étudiant</template
        >
        <template v-slot:legend>
          Entre le code de confirmation que tu as reçu par mail.
        </template>
        <template v-slot:input>
          <ConfirmationCode @input="setCode"> </ConfirmationCode>
        </template>
      </ConfirmationTextField>
    </ConfirmationQuestion>
    <ConfirmationQuestion
      step="2"
      v-if="currentStep === 1"
      :current="currentStep + 1"
      :max="steps.length"
      @next="setName"
      @previous="previous"
      :value="entries.firstName"
    >
      <ConfirmationTextField>
        <template v-slot:title>Et ton prénom ? </template>
        <template v-slot:legend>
          Parce que te dire bonjour par ton prénom c’est toujours plus sympa.
        </template>
        <template v-slot:input>
          <input
            type="text"
            placeholder="Entre ton prénom ..."
            v-model="entries.firstName"
          />
        </template>
      </ConfirmationTextField>
    </ConfirmationQuestion>
    <ConfirmationQuestion
      step="3"
      v-if="currentStep === 2"
      :current="currentStep + 1"
      :max="steps.length"
      @next="setSchool"
      @previous="previous"
      :value="entries.school"
    >
      <ConfirmationSearchField @input="setSchoolFromUser">
        <template v-slot:title> Dans quel établissement es-tu ? </template>
        <template v-slot:legend>
          Nous avons besoin de savoir dans quel établissement tu es pour pouvoir
          te proposer les bonnes UE.
        </template>
      </ConfirmationSearchField>
    </ConfirmationQuestion>
    <ConfirmationQuestion
      step="4"
      v-if="currentStep === 3"
      :current="currentStep + 1"
      :max="steps.length"
      @next="setICal"
      @previous="previous"
      :value="entries.ical"
    >
      <ConfirmationTextField>
        <template v-slot:title> Quel est ton lien ICal ? </template>
        <template v-slot:legend>
          Pour pouvoir te proposer un planning personnalisé, nous avons besoin
          de ton lien ICal. Si tu ne sais pas comment le trouver,
          <a
            href="https://app.umontpellier.fr/prose-etudiant/protected/planning"
            target="_blank"
            >clique ici.</a
          >
        </template>
        <template v-slot:input>
          <input
            type="text"
            placeholder="Entre ton lien ICal..."
            v-model="entries.ical"
          />
        </template>
      </ConfirmationTextField>
    </ConfirmationQuestion>
    <ConfirmationQuestion
      step="5"
      v-if="currentStep === 4"
      :current="currentStep + 1"
      :max="steps.length"
      @next="setRestaurants"
      @previous="previous"
      :value="entries.preferences"
    >
      <ConfirmationSuggestionField
        @input="setRestaurantsFromUser"
        placeholder="Entre le nom d'un restaurant universitaire"
      >
        <template v-slot:title>
          Quelles sont tes restaurants universitaires préférés ?
        </template>
        <template v-slot:legend>
          Nous te proposerons des restaurants universitaires en fonction de tes
          préférences.
        </template>
      </ConfirmationSuggestionField>
    </ConfirmationQuestion>
    <div class="final-step" v-if="currentStep === 5">
      <h2>
        Merci d’avoir rempli ce formulaire ! Tu peux maintenant profiter de
        l’application.
      </h2>
      <router-link to="/restaurants">
        <button class="button">Accéder à Hack The Crous</button>
      </router-link>
    </div>
  </main>
</template>
<script>
import ProgessSteps from "@/components/ProgessSteps.vue";
import ConfirmationQuestion from "@/components/ConfirmationQuestion.vue";
import ConfirmationTextField from "@/components/ConfirmationTextField.vue";
import ConfirmationSearchField from "@/components/ConfirmationSearchField.vue";
import ConfirmationSuggestionField from "@/components/ConfirmationSuggestionField.vue";
import ConfirmationCode from "@/components/ConfirmationCode.vue";
import { useUserStore } from "@/stores/user.js";
import { useAlertsStore } from "@/stores/alerts.js";
import { usePreferencesStore } from "@/stores/preferences.js";
import { useRouter } from "vue-router";
import axios from "axios";
import { endpoint } from "@/main";

export default {
  name: "RegisterConfirmation",
  components: {
    ProgessSteps,
    ConfirmationQuestion,
    ConfirmationTextField,
    ConfirmationSearchField,
    ConfirmationSuggestionField,
    ConfirmationCode,
  },
  setup() {
    const userStore = useUserStore();
    const alertsStore = useAlertsStore();
    const router = useRouter();
    const preferenceStore = usePreferencesStore();

    if (!userStore.isLogged) {
      alertsStore.addAlert({
        type: "error",
        message: "Tu dois être connecté pour accéder à cette page",
      });
      router.push("/login");
    }

    return { userStore, alertsStore, preferenceStore };
  },
  data() {
    return {
      steps: ["Mail", "Prénom", "Etablissement", "ICal", "Préférences"],
      currentStep: 0,
      entries: {
        mail: "",
        firstName: "",
        school: "",
        code: "",
        ical: "",
        preferences: [],
      },
    };
  },
  methods: {
    next() {
      this.currentStep++;
    },
    halfNext() {
      this.currentStep += 0.5;
    },
    previous() {
      this.currentStep--;
    },
    setName() {
      this.preferenceStore.setName(this.entries.firstName);
      this.next();
    },
    setSchoolFromUser(school){
      this.entries.school = school;
    },
    setSchool() {
      this.preferenceStore.setSchool(this.entries.school);
      console.log(this.entries.school);
      this.next();
    },
    setRestaurants() {
      this.preferenceStore.setRestaurants(this.entries.preferences);
      console.log(this.entries.preferences);
      this.next();
    },
    setRestaurantsFromUser(restaurants){
      this.entries.preferences = restaurants;
    },
    setICal() {
      this.preferenceStore.setIcalLink(this.entries.ical);
      this.next();
    },
    setCode(code) {
      this.entries.code = code;
    },
    confirmMail() {
      axios
        .post(
          `${endpoint}/mail/confirm`,
          {
            firstname: this.entries.firstName,
          },
          {
            headers: {
              Authorization: `Bearer ${this.userStore.getToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.type === "Error") {
            this.alertsStore.addAlert({
              status: "Error",
              message: res.data.message,
            });
            return;
          }
          this.alertsStore.addAlert({
            status: "Success",
            message: "Ton code a bien été envoyé !",
          });
          this.halfNext();
          this.alertsStore.addPopUp(
            "On t'a envoyé un mail avec ton code !",
            "Vérifie tes spams si tu ne le trouves pas dans ta boîte de réception ! Aussi, le mail peut prendre quelques minutes à arriver."
          );
        });
    },
    confirmCode() {
      axios
        .post(
          `${endpoint}/mail/code`,
          {
            nonce: this.entries.code,
          },
          {
            headers: {
              Authorization: `Bearer ${this.userStore.getToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.data.type === "Error") {
            this.alertsStore.addAlert({
              status: "Error",
              message: res.data.message,
            });
            return;
          }
          this.alertsStore.addAlert({
            status: "Success",
            message: "Ton mail a bien été confirmé !",
          });
          this.halfNext();
        });
    },
  },
  watch: {
    currentStep() {
      if (this.currentStep === this.steps.length) {
        console.log(this.entries);
        this.preferenceStore.savePreferences();
      } else if (this.currentStep < 0) {
        this.currentStep = 0;
      }
    },
  },
};
</script>
<style scoped lang="scss">
main {
  display: flex;
  margin-top: 15%;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .final-step{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    button{
      margin-top:20px;
      border: 1px solid var(--color-primary);
      background:transparent;
      border-radius: 5px;
      padding: 10px 20px;
      color: var(--color-primary);
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        background: var(--color-primary);
        color: var(--color-background);
      }
    }
  }
  form {
    width: 70%;
  }
  input {
    width: 100%;
    height: 50px;
    border: none;
    color: var(--color-heading);
    border-bottom: 1px solid var(--color-heading);
    background: none;
    padding: 0 10px;
    font-size: 1.5rem;
    margin-top: 10px;
    margin-bottom: 30px;
    font-family: Inter, sans-serif;
    &:focus {
      outline: none;
    }
  }
  a {
    color: var(--color-primary);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
