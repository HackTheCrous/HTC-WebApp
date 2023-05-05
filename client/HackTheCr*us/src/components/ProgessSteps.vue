<template>
    <div>
        <ProgressStep v-for="(step, index) in steps" :status="this.getStepClass(index)" :step-name="step" :last="index === steps.length-1">{{index}}</ProgressStep>
    </div>
</template>

<script>
import ProgressStep from "@/components/ProgressStep.vue";

export default {
    name: "ProgessSteps",
    components: {ProgressStep},
    props: ['steps', 'current'],
    methods: {
        getStepClass(step) {
            if (step === this.current) {
                return 'current';
            } else if (step < this.current) {
                return 'done';
            } else {
                return 'todo';
            }
        }
    }

}
</script>

<style scoped>
    div{
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 50%;
        @media screen and (max-width: 1000px){
            width: 85%;
        }
        margin-bottom: 100px;
    }
</style>