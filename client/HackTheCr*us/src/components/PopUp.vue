<template>
  <div v-if="this.focused" class="popup-container">
    <div class="popup">
      <div>
        ⚠️🤙
      </div>
      <div>
        <slot></slot>
      </div>
      <div>
        <button @click="this.alerts.popPopUp()">Ok !</button>
      </div>
    </div>
  </div>

</template>

<script>
import { useAlertsStore } from "@/stores/alerts";

export default {
  name: "PopUp",
  setup() {
    const alerts = useAlertsStore();
    return { alerts };
  },
  data(){
    return {
      focused : true
    }
  }
}
</script>

<style scoped lang="scss">
  .popup-container{
    position:fixed;
    z-index:10000;
    height:100vh;
    width:100%;
    top:0;
    left:0;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px);
    .popup{
      width:40%;
      height:fit-content;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--color-border);
      border-radius:5px;
      background: var(--color-background-mute);
      padding: 20px 40px;

      div{
        display:flex;
        flex-direction: column;
        align-items: center;
        button{
          width:90%;

          margin-top:20px;
          padding-bottom: 5px;
          padding-top:5px;
          font-family: Inter,sans-serif;
          border: 1px solid var(--color-text);
          background:transparent;
          color:var(--color-text);

          &:hover{
            border: 1px solid var(--color-background);
            background: var(--color-background);
            color:var(--color-text);
          }
        }
      }
    }
  }
</style>
