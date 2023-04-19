<script>
export default {
    data() {
        return {

        }
    },
    props: {
        focused: String,
        name: String,
    },
    name: "TagPlace",
    methods: {
        handleClick() {
            const data = this.name
            this.$emit('child-clicked', data);
        }
    }
}
</script>

<template>
    <div v-if="this.name === this.focused" @click="handleClick" class="tag focus">
        <p>
            {{ this.name }}
        </p>
    </div>
    <div v-else @click="handleClick" class="tag">
        <p>
            {{ this.name }}
        </p>
    </div>
</template>

<style scoped>

.tag {
    font-family: Inter, sans-serif;
    font-weight: 300;
    width: fit-content;
    padding-left: 20px;
    padding-right: 20px;
}

.tag.focus {
    background: black;
    color: white;
    border-radius: 50px;
    text-align: center;

}
</style>