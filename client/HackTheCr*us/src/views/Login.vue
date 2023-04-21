<template>
    <h1>Vue Login</h1>
    <section id="register">
        <main>
            <form>
                <h2>Bienvenue !</h2>
                <h4>Bienvenue ! Entrez vos informations pour rejoindre hack the cr*us</h4>
                <div>
                    <label for="mail">Email</label>
                    <input type="email" name="mail" id="mail" placeholder="Entrez votre mail"/>
                </div>
                <div>
                    <label for="mail">Mot de passe</label>
                    <input type="email" name="mail" id="mail" placeholder="Entrez votre mot de passe"/>
                </div>


                <button>Se connecter</button>
                <span>
                    <p>Vous n'avez pas de compte ?</p> <router-link to="/register">Inscrivez-vous</router-link>
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
export default {
    name: "Login"
}
</script>

<style scoped lang="scss">
section#register{
  height: calc(100vh - 85px);
  width:100%;
  display: flex;
  flex-direction: row;
  main {
    width: 50%;
    height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    form{
      h2{
        font-family: Inter,sans-serif;
        font-size:40px;
      }
      h4{
        color : #777777;
        margin-bottom: 10px;
      }
      div{
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        input{
          padding:10px 5px;
          font-family: Inter,sans-serif;
          border: 1px #d5d5d5 solid;
          background: #ffffff;
          border-radius :5px;
          &:focus{
            outline: none;
            background: white;
          }

        }
      }

      button{
        margin-top:20px;
        width:100%;
        padding:10px 0px;
        border:1px solid #53e78a;
        border-radius : 5px;
        background: transparent;

        color: #53e78a;
        font-size:15px;
        &:hover{
          color : white;
          background: #53e78a;
          cursor: pointer;
        }
      }

      span{
        display: flex;
        flex-direction: row;
        width:100%;
        align-items: center;
        justify-content: center;
        margin-top:10px;
        a{
          margin-left:5px;
          color : #53e78a;
          text-decoration: none;
        }
      }

    }
  }
  aside{
    $posY: calc(50vw - 5%);
    width: $posY;
    background: #f8f8f8;
    height:100% ;
    position: fixed;
    top:0px;
    left:calc(100vw - $posY);
    display: flex;
    align-items: center;
    justify-content: center;
    #sun{
      #round{
        height:15vw;
        width:15vw;
        background: #63F49E;
        border-radius: 100%;
        position:relative;
        z-index:2;
      }
      #sea{
        height:7.5vw;
        transform: translateY(150%) scale(2);
        width:100%;
        position:absolute;
        z-index:3;
        backdrop-filter:blur(10px);
        top:0px;

      }
    }
  }
}

</style>