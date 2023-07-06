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
      placeholder="Entre ton établissement ..."
      v-model="value"
      @keydown.down="cursor++"
      @keydown.up="cursor--"
      @input="updateSuggestions"
    />
    <ul>
      <li
        v-for="(suggestion, index) in suggestions"
        :class="cursor === index ? 'focused' : ''"
        :key="suggestion.idschool"
        @click="cursor = index"
      >
        {{ suggestion.name }}
      </li>
    </ul>
  </div>
</template>
<script>
import { apolloClient } from "@/main";
import gql from "graphql-tag";

const GET_SCHOOL_LIKE = gql`
  query SearchSchool($queryValue: String) {
    searchSchool(query: $queryValue) {
      idschool
      name
    }
  }
`;

export default {
  name: "ConfirmationSearchField",
  props: ["title", "legend"],
  emits: ["input"],
  data() {
    return {
      value: "",
      suggestions: [],
      cursor: -1,
    };
  },
  methods: {
    getSuggestions() {
      return new Promise((resolve, reject) => {
        apolloClient
          .query({
            query: GET_SCHOOL_LIKE,
            variables: {
              queryValue: this.value,
            },
          })
          .then((res) => {
            console.log(res.data.searchSchool);
            resolve(res.data.searchSchool);
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
  },
  watch: {
    value() {
      const idSchoolSelected = this.suggestions[this.cursor]?.idschool;
      this.$emit("input", idSchoolSelected);
    },
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
  margin: 0;
  margin-bottom: 20px;
  max-height: 50vh;
  overflow-y: scroll;
  li {
    font-size: 1.5rem;
    padding-top: 5px;
    padding-bottom: 5px;
    font-weight: 300;
    margin: 0;
    &.focused {
      background: var(--color-heading);
      color: var(--color-background);
    }
  }
}
</style>
