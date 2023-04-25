<template>
    <header>
        <img src="@/assets/logoV2.png" alt="logo">
    </header>
    <main>
        <ProgessSteps :steps="steps" :current="this.currentStep"/>

        <form v-if="this.currentStep === 1 ">
            <div id="side">
                <p>{{ this.currentStep }} <b>-></b></p>
            </div>
            <div id="main">
                <h3>Quel est ton prénom ?</h3>
                <p class="sub">Ceci nous permettra de t’identifier sur l’application</p>
                <input type="text" placeholder="Entre ton prénom..."/>
                <span class="submitters">
                    <span>
                        <button>Envoyer</button>
                        <p>press <b>Enter ↵</b></p>
                    </span>
                    <button class="skip">Passer</button>
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
                <input type="text" placeholder="Entre le nom de ton établissement..."/>
                <ul class="suggestions">
                    <li>
                        IUT Montpellier-Sète (Montpellier)
                    </li>
                    <li>
                        IUT Montpellier-Sète (Sète)
                    </li>
                    <li>
                        Polytech Montpellier
                    </li>
                    <li>
                        + ajouter un établissement
                    </li>
                </ul>
            </div>
        </form>
    </main>
</template>

<script>
import ProgessSteps from "@/components/ProgessSteps.vue";

export default {
    name: "RegistrationConfirmation",
    components: {ProgessSteps},
    data() {
        return {
            steps: ['Inscription', 'Prénom', 'ICal', 'Préférences'],
            currentStep: 2
        }
    }
}
</script>

<style scoped lang="scss">
header {
  height: 75px;
  position: fixed;
  left: 0;
  top: 0;

  img {
    margin-top: 15px;
    margin-left: 25px;
    height: 100%;
  }
}

main {
  height: 100vh;
  width: 100%;
  background: linear-gradient(227.95deg, rgba(36, 238, 118, 0.3196) 17.63%, rgba(197, 255, 213, 0.0) 47.27%, rgba(197, 255, 213, 0.47) 80.86%) center;
  background-size: 200%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  form {
    width: 70%;
    display: flex;
    flex-direction: row;

    #side {
      padding-top: 15px;
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
        font-size: 40px;

        &:before {
          content: attr(id);
          font-size: 20px;

        }
      }

      .suggestions {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          font-size: 20px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.42);
            &:last-of-type{
                color: #24EE76;
                border-bottom: 1px solid #24EE76;

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
          font-size: 20px;
          border: 0px;
          border-radius: 5px;
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
        font-size: 25px;
      }

      input {
        font-size: 35px;
        font-family: Inter, sans-serif;
        width: 100%;
        border: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.42);
        background: transparent;
        padding: 0;

        color: rgba(0, 0, 0, 0.42);
        margin: 0 0 15px;

        &:focus {
          outline: none;
          border-bottom: 1px solid black;
          color: black;
        }
      }
    }


  }
}

</style>