<template>
  <div :class="warning ? 'setting-field warning' : 'setting-field'">
    <form>
      <div class="upper">
        <h2>
          <slot name="title"></slot>
        </h2>
        <p>
          <slot name="label"></slot>
        </p>
        <input v-if="!warning" :class="this.long ? 'long' : ''" type="text" v-model="value" @input="$emit('input', value)" :placeholder="placeholder">
        <SearchSuggestions v-if="suggestions.length>0" :data="suggestions" :focus="value" @onfocus="setfocus"/>
      </div>
      <div class="validate">
        <p><slot name="hint"></slot></p>
        <button v-if="warning" @click="handleClick">Supprimer</button>
        <button v-else-if="!isValid" class="disabled" disabled >Modifier</button>
        <button v-else @click="handleClick">Modifier</button>
      </div>
    </form>
  </div>
</template>

<script>
import SearchSuggestions from "./SearchSuggestions.vue";

export default {
  name: "SettingField",
  components: {SearchSuggestions},
  emits: ['input', 'send'],
  data(){
    return {
      value : "",
    }
  },
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    long: {
      type: Boolean,
      default: false
    },
    suggestions: {
      type: Array,
      default: []
    },
    warning: {
      type: Boolean,
      default: false
    },
    regex: {
      type: String
    }
  },
  methods: {
    setfocus(e){
      this.value = e;
    },
    handleClick(e){
      e.preventDefault();
      this.$emit('send', this.value);
    }
  },
  computed:{
    isValid(){
      console.log(this.value.match(this.regex));
      return this.value.match(this.regex) !== null;
    }
  }
}
</script>

<style scoped lang="scss">
  .setting-field{
    border: 1px solid var(--color-border);
    border-radius:7px;
    margin-top:10px;
    background: var(--color-background-soft);

    @media screen and (max-width:1000px){
      width:95%;
    }

    &.warning{
      border: 1px solid var(--color-warning);
      .validate{
        border-top: 1px solid var(--color-warning);
        button{
          background: var(--color-warning);
          border:1px solid var(--color-warning);
          &:hover{
            color: var(--color-warning);
            background: transparent;
            border:1px solid var(--color-warning);
          }
        }
      }
    }

    .upper, .validate{
      padding: 20px 15px;
      p{
        width:90%;
        font-weight:300;
        margin-bottom: 15px;
        @media screen and (max-width:1000px){
          width:100%;
        }
      }
    }
    h2{
      font-size:22px;
      font-weight:400;
      padding:0;
      margin:0;
      line-height: 1.5;
    }

    input{
      margin-bottom: 5px;
      border: 1px solid var(--color-border);
      background: var(--color-background);
      color: var(--color-text);
      padding: 10px 15px;
      font-family: Inter, sans-serif;
      font-size: 15px;
      border-radius: 5px;
      width:50%;

      &.long{
        width:80%;
        @media screen and (max-width:1000px){
          width:100%;
        }
      }
      @media screen and (max-width:1000px){
        width:100%;
      }
      &:focus{
        outline: none;
        border: 1px solid var(--color-primary);
      }
    }
    .search-suggestions{
      margin-top:10px;
    }

    .validate{
      border-top: 1px solid var(--color-border);
      background: var(--color-background);
      display: flex;
      flex-direction: row;
      @media screen and (max-width: 1000px){
        flex-direction: column;
      }
      justify-content: space-between;
      align-items: center;
      border-radius: 0px 0px 7px 7px;
      p{
        margin:0;

      }


      button{
        background: var(--color-text);
        font-family: Inter,sans-serif;
        font-size: 13px;
        padding: 7px 40px;
        border-radius: 3px;
        border:1px solid var(--color-text);
        font-weight:400;
        color: var(--color-background);
        transition: all 0.2s ease-in-out;
        @media screen and (max-width: 1000px){
          width:100%;
          margin-top:10px;
        }
        &:hover{
          cursor: pointer;
          color: var(--color-text);
          background: var(--color-text-hover);
          transition: all 0.2s ease-in-out;
        }
        &.disabled{
          opacity:0.5;
        }
      }
    }
  }
</style>