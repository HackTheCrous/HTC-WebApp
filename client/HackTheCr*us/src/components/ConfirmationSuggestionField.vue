<template>
  <h2>
    <slot name="title"></slot>
  </h2>
  <p>
    <slot name="legend"></slot>
  </p>
  <div>
    <input
      type="text"
      :placeholder="placeholder"
      v-model="value"
      @keydown.down="cursor++"
      @keydown.up="cursor--"
      @input="updateSuggestions"
    />
    <ul>
      <li
        v-for="suggestion in suggestions"
        :class="isSelected(suggestion) ? 'focused' : ''"
        :key="suggestion.idrestaurant"
        @click="toggle(suggestion)"
      >
        {{ suggestion.name }}
      </li>
    </ul>
  </div>
</template>
<script>
import { apolloClient } from "@/main";
import gql from "graphql-tag";

const GET_RESTAURANT_LIKE = gql`
query Search ($queryValue: String){
    searchRestaurant(query: $queryValue) {
        idrestaurant
        name
    }
}`

export default {
  name: "ConfirmationSuggestionField",
  props: ["title", "legend", "placeholder"],
  emits: ["input"],
  data() {
    return {
      values:[],
      value: "",
      suggestions: [],
    };
  },
  mounted() {
    this.updateSuggestions();
  },
  methods: {
    getSuggestions() {
      return new Promise((resolve, reject) => {
        apolloClient
          .query({
            query: GET_RESTAURANT_LIKE ,
            variables: {
              queryValue: this.value,
            },
          })
          .then((res) => {
            console.log(res.data.searchRestaurant);
            resolve(res.data.searchRestaurant);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    },
    updateSuggestions() {
      this.getSuggestions().then((res) => {
        this.suggestions = res;
      });
    },
    toggle(suggestion) {
      if (this.values.includes(suggestion)) {
        this.values = this.values.filter((s) => s !== suggestion);
      } else {
        this.values.push(suggestion);
      }
      this.$emit("input", this.values.map((s) => s.idrestaurant));
    },
    isSelected(suggestion) {
      return this.values.includes(suggestion);
    },
  },
  watch: {
    cursor(val) {
      if (val >= 0 && val < this.suggestions.length) {
        this.value = this.suggestions[val].name;
      } else if (val < 0) {
        this.cursor = this.suggestions.length - 1;
      } else if (val >= this.suggestions.length) {
        this.cursor = -1;
      }
    },
  },
};
</script>
<style scoped lang="scss">
h2 {
  font-size: 2.5rem;
  margin: 0;
}
p {
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0;
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
  font-family: Inter, sans-serif;
  &:focus {
    outline: none;
  }
}
ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  margin-top: 20px;
  margin-bottom: 20px;
  width:100%;
  li {
    font-size: 1.2rem;
    font-weight: 300;
    margin: 0;
    border: 1px solid var(--color-heading);
    border-radius: 100px;
    margin-right: 10px;
    padding: 5px 10px;
    margin-bottom: 10px;
    width:fit-content;
    &.focused {
      background: var(--color-primary);
      color: var(--color-background);
      border: 1px solid var(--color-primary);
    }
  }
}
</style>
