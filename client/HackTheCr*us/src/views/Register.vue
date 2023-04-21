<template>
    <h1>Vue Register</h1>
    <section id="register">
        <main>
            <form>
                <h2>Bienvenue !</h2>
                <h4>Bienvenue ! Entrez vos informations pour rejoindre hack the cr*us</h4>
                <div>
                    <label for="mail">Email*</label>
                    <input required v-model="mail" type="email" name="mail" id="mail" placeholder="Entrez votre mail"/>
                </div>
                <div>
                    <label for="password">Mot de passe*</label>
                    <input required v-model="password" type="password" name="password" id="password"
                           placeholder="Entrez votre mot de passe"/>
                </div>
                <div>
                    <label for="passwordConfirmation">Mot de passe (confirmation)*</label>
                    <input required :class="passwordMatch" v-model="passwordConfirmation" type="passwordConfirmation"
                           name="passwordConfirmation"
                           id="passwordConfirmation" placeholder="Répétez votre mot de passe"/>
                </div>

                <button v-if="passwordMatch!=='green'" disabled @click="submit">S'enregister</button>
                <button v-else @click="submit">S'enregister</button>
                <span>
                    <p>Vous avez déjà un compte ? </p> <router-link to="/login">Connectez-vous</router-link>
                </span>
            </form>
        </main>
        <aside>
            <div id="sun">
                <div id="round"></div>
                <div id="sea"></div>
            </div>
        </aside>
    </section>
</template>

<script>

import {apolloClient} from "@/main";
import gql from "graphql-tag";

const REGISTER_USER = gql`
mutation Register($mail: String!, $password: String!){
    register(mail: $mail, password: $password){
        iduser
        mail
    }
}
`

export default {
    name: "Register",

    data() {
        return {
            mail: '',
            password: '',
            passwordConfirmation: ''
        }
    },
    methods: {
        submit() {
            if (this.password === this.passwordConfirmation) {
                apolloClient.mutate({
                    mutation: REGISTER_USER,
                    variables: {
                        mail: this.mail,
                        password: this.password
                    }
                }).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    },
    computed: {
        passwordMatch() {
            return (this.mail.length > 0 && this.password.length>5 && this.password === this.passwordConfirmation) ? 'green' : 'red';
        }
    }


}
</script>

<style scoped lang="scss">
section#register {
  height: calc(100vh - 85px);
  width: 100%;
  display: flex;
  flex-direction: row;

  main {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    form {
      h2 {
        font-family: Inter, sans-serif;
        font-size: 40px;
      }

      h4 {
        color: #777777;
        margin-bottom: 10px;
      }

      div {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;

        input {
          padding: 10px 5px;
          font-family: Inter, sans-serif;
          border: 1px #d5d5d5 solid;
          background: #ffffff;
          border-radius: 5px;

          &:focus {
            outline: none;
            background: white;
          }

          &.red {
            border: 1px red solid;
            background: rgba(252, 217, 217, 0.87);
          }
        }
      }

      button {
        margin-top: 20px;
        width: 100%;
        padding: 10px 0px;
        border: 1px solid #53e78a;
        border-radius: 5px;
        background: transparent;

        color: #53e78a;
        font-size: 15px;

        &:hover {
          color: white;
          background: #53e78a;
          cursor: pointer;
        }
      }

      span {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        justify-content: center;
        margin-top: 10px;

        a {
          margin-left: 5px;
          color: #53e78a;
          text-decoration: none;
        }
      }

    }
  }

  aside {
    $posY: calc(50vw - 5%);
    width: $posY;
    background: #f8f8f8;
    height: 100%;
    position: fixed;
    top: 0px;
    left: calc(100vw - $posY);
    display: flex;
    align-items: center;
    justify-content: center;

    #sun {
      #round {
        height: 15vw;
        width: 15vw;
        background: #63F49E;
        border-radius: 100%;
        position: relative;
        z-index: 2;
      }

      #sea {
        height: 7.5vw;
        transform: translateY(150%) scale(2);
        width: 100%;
        position: absolute;
        z-index: 3;
        backdrop-filter: blur(10px);
        top: 0px;

      }
    }
  }
}

</style>