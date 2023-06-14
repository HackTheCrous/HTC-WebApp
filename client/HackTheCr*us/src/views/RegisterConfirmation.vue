<template>
  <main>
    <ProgessSteps :steps="steps" :current="currentStep" />
    <ConfirmationQuestion step="1" :current="currentStep+1" @next="next" @previous="previous">
      <ConfirmationTextField>
        <template v-slot:title> Quel est ton mail <u>étudiant</u> ? </template>
        <template v-slot:legend>
          Ceci nous permettra de t’identifier sur l’application et de vérifier
          que tu es bien à la fac. ⚠️  Ton adresse mail doit terminer par
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
    <ConfirmationQuestion step="2" :current="currentStep+1" @next="next" @previous="previous">
      <ConfirmationTextField>
        <template v-slot:title> ... et ton prénom ? </template>
        <template v-slot:legend>
          Parce que te dire bonjour par ton prénom c’est toujours plus sympa.
        </template>
        <template v-slot:input>
          <input type="text" placeholder="Entre ton prénom ..." v-model="entries.firstName"/>
        </template>
      </ConfirmationTextField>
    </ConfirmationQuestion>
  </main>
</template>
<script>
import ProgessSteps from "@/components/ProgessSteps.vue";
import ConfirmationQuestion from "@/components/ConfirmationQuestion.vue";
import ConfirmationTextField from "@/components/ConfirmationTextField.vue";

export default {
  name: "RegisterConfirmation",
  components: {
    ProgessSteps,
    ConfirmationQuestion,
    ConfirmationTextField,
  },
  data() {
    return {
      steps: ["Mail", "Prénom", "Etablissement", "ICal", "Préférences"],
      currentStep: 0,
      entries:{
        mail: "",
        firstName: "",
        school: "",
        ical: "",
        preferences: [],
      }
    };
  },
  methods: {
    next() {
      this.currentStep++;
    },
    previous() {
      this.currentStep--;
    },
  }
};
</script>
<style scoped lang="scss">
main {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
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
}
</style>
