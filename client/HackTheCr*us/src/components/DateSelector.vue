<template>
    <h2 @mousedown="this.edit" v-if="!editing" class="date">
        {{ this.formatDate(this.date) }}
    </h2>
    <input v-else type="date" :value="this.date" class="date" @change="$emit('change', $event.target.value)"/>
</template>

<script>
export default {
    name: "DateSelector",
    emits: ['change'],
    mounted() {
        document.addEventListener('click', (e) => {
            if (this.editing && !this.$el.contains(e.target)) {
                this.editing = false;
            }
        })
    },
    props: {
        date: Date
    },
    data() {
        return {
            editing: false
        }
    },
    methods: {
        edit() {
            this.editing = true;
        },
        formatDate(date) {
            if(typeof date === 'string') date = new Date(date);
            const formated = date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return formated.charAt(0).toUpperCase() + formated.slice(1);
        }
    }
}
</script>

<style scoped>
.date {
    margin: 0;
    padding: 0;
    font-size: 20px;
    font-weight: 300;
    background: none;
    border: none;
    font-family: Inter, sans-serif;
    color: var(--color-text);
    height: 30px;
}
</style>