<template>
    <div class="menu-foody">
        <h4>
            {{ this.name }} du {{ this.formatDate(this.time) }}
        </h4>
        <div v-for="foody in this.foodies">
            <h5>{{ foody.type }}</h5>
            <ul>
                <li v-for="food in foody.food" v-html="this.highlightFood(food)" class="food">
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

    data(){
        return {
            highlight: this.$route.query.search
        }
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
        },
        highlightFood(food){
            if(food.toUpperCase().indexOf(this.highlight.toUpperCase()) === -1)
                return food;
            return food.substring(0, food.toUpperCase().indexOf(this.highlight.toUpperCase()) - 1)
                + "<b class='highlight'>" + food.substring(food.toUpperCase().indexOf(this.highlight.toUpperCase()) -1 , food.toUpperCase().indexOf(this.highlight.toUpperCase()) + this.highlight.length)
                + "</b>" + food.substring(food.toUpperCase().indexOf(this.highlight.toUpperCase()) + this.highlight.length, food.length)
        },
    }
}

</script>

<style lang="scss">
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

.highlight{
    font-weight: 800;
}

</style>