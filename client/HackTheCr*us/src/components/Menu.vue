<template>
    <div class="menu-foody">
        <h4>
            {{ this.name }} du {{ this.formatDate(this.time) }}
        </h4>
        <div v-for="foody in this.foodies">
            <h5>{{ foody.type }}</h5>
            <ul>
                <li v-for="food in foody.food">
                    {{ food }}
                </li>
            </ul>
        </div>

    </div>
</template>

<script>

export default {
    props: {
        name: String,
        foodies: Object,
        time: String
    },
    methods: {
        /**
         * format the given date to dayasname mm yyyy
         * @param date of type Int
         */
        formatDate(date) {
            const dateFormat = new Date(parseInt(date));

            const formated = dateFormat.toLocaleDateString('fr-FR', {
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

<style scoped lang="scss">
.menu-foody {
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 1000px){
        margin-bottom: 30px;
    }
    li{
        @media screen and (max-width: 1000px){
            font-size: 17px;
        }
    }
}

h4{
    margin: 0px;
    padding: 0px;
    font-size: 1.2em;
    font-weight: 600;
}



</style>