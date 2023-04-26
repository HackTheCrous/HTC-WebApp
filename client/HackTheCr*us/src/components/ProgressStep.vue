<template>
    <div v-if="status === 'done'" class="step done" :id="stepName">
        <tick/>
    </div>
    <div v-else-if="status === 'current'" class="step current" :id="stepName">
        <slot></slot>
    </div>
    <div v-else class="step todo" :id="stepName">
        <slot></slot>
    </div>
    <div v-if="!last" :class="'line '+status"></div>
</template>

<script>
import Tick from "@/assets/tick.vue";

export default {
    name: "ProgressStep",
    components: {Tick},
    props: ['status', 'stepName','last']
}
</script>

<style scoped>
.step::before {
    content: attr(id);
    position: absolute;
    transform: translateY(35px);
    color: #848c84;
}

.step.current::before {
    font-weight: bold;
}

.line{
    height: 2px;
    width: 20%;
    background-color: #848c84;
}

.line.done{
    background-color: #24EE76;
}

.step{
    height:25px;
    width:25px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
}

.step.done, .step.current{
    background-color: #24EE76;
}

.step.current{
    color:white;
}

.step.todo{
    color : #848c84;
    border:2px solid #848c84;
}
</style>