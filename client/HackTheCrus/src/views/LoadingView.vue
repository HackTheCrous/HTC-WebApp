<template>
  <div class="loading-view">
    <div class="filler"></div>
    <div class="center">
      <logo/>
      <h2><slot></slot></h2>
    </div>
    <div class="bottom">
      <p>
        PAR
        DES <em>ETUDIANTS</em><br>
        ET FAIT AVEC LE <i>♡</i>
      </p>
    </div>
  </div>
</template>

<script>
import Logo from "../assets/logo.vue";

export default {
  name: "LoadingView",
  components: {Logo}
}
</script>

<style scoped lang="scss">
@keyframes loading_logo {
  0% {
    transform: rotate(0deg);
  }
  70% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading_legend {
  0% {
    content: '.';
  }
  50% {
    content: '..';
  }
  100% {
    content: '...';
  }

}


.loading-view {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 7000;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;

    svg {
      height: 100px;
      width: 100px;
      animation: loading_logo 2s infinite ease;
    }

    h2 {
      font-family: VT323, monospace;
      font-size: 30Px;
      text-transform: uppercase;
      &::after {
        position: absolute;
        content: '';
        animation: loading_legend 1.5s infinite linear;
      }
      @media screen and (max-width: 1000px) {
        font-size: 20Px;
      }
    }

    p {
      text-align: center;
    }

    em {
      font-family: VT323, monospace;
      font-size: 20Px;
      line-height: 0;

      font-style: normal;
    }

    i {
      color: var(--color-primary);
      font-size: 20px;
      line-height: 0;
    }

    &.bottom {
      margin-bottom: 20px;
    }
  }
}
</style>