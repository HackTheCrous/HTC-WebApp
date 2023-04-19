<template>
    <h4>
        {{ this.name }} du {{ this.formatDate(new Date(parseInt(this.time))) }}
        <div v-for="foody in this.foodies">
            <h5>{{ foody.type }}</h5>
            <ul>
                <li v-for="food in foody.food">
                    {{ food }}
                </li>
            </ul>
        </div>
    </h4>
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
         * @param date of type Date
         */
        formatDate(date){
            const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
            const months= ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
            return days[date.getDay()]+ " " + months[date.getMonth()]+ " " + date.getFullYear();
        }
    }
}

</script>

<style>

</style>