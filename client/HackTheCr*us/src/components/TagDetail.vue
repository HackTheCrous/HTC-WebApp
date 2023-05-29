<template>
    <p :class="this.light ? 'tag-detail light' : 'tag-detail'">
        <slot></slot>
    </p>
</template>

<script>
export default {
    name: "TagDetail",
    props: ["value", "light"]
}
</script>

<style scoped>
p {
    border-radius: 30px;
    border: 1px var(--color-text) solid;
    opacity: 0.8;
    background-color: transparent;
    width: fit-content;
    font-size: 12px;
    padding: 2px 7px;
    color: var(--color-text);
}
p.light {
    border: 1px var(--color-background) solid;
    color: var(--color-background);
}
</style>
