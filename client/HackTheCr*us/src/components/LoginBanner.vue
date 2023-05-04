<template>
    <div class="banner">
        <div>
            <h2>Marre de l'ent ?</h2>
            <p>Adopte hackTheCr*us! Une plateforme pour les étudiants par des étudiants.</p>
        </div>
        <span>
          <router-link to="/login">Se connecter</router-link>
          <router-link to="/register">S'inscrire</router-link>
      </span>
    </div>
</template>

<script>
export default {
    name: "LoginBanner.vue"
}
</script>

<style lang="scss" scoped>
.banner {
  border-top: 1px solid rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #63F49E;
  color: black;
  font-weight: 600;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding: 10px 15%;


  a {
    font-family: Inter, sans-serif;
    font-size: 17px;
  }

  p {
    font-size: 15px;
    margin: 0;
    transform: translate(0, -10px);
  }

  div {
    transform: translate(0, 5px);
  }

  h2 {
    font-size: 23px;
    margin: 0;
    font-weight: 600;
  }

  span {
    width: fit-content;
    display: flex;
    flex-direction: row;
    a {
      padding: 10px 20px;
      border-radius: 500px;
      text-decoration: none;
      width: fit-content;
      display: block;
      height:fit-content;
    }

    a:nth-child(odd) {
      background-color: #63F49E;
      color: black;
      margin-right: 10px;
      border: 1px solid black;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    a:nth-child(even) {
      background-color: black;
      color: #63F49E;
      border: 1px solid black;

      &:hover {
        background-color: rgba(0, 0, 0, 0.8);

      }
    }
  }
}
</style>