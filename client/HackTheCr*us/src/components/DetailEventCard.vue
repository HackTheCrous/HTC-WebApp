<template>
    <router-link :to="`/calendar/${this.start.getTime()}`" class="event"
                 :style="{'top' : this.offsetY + 'px', 'min-height' : this.height+ 'px'}">
        <b>{{ this.summary }}</b>
        {{ this.location }}<br/>
        {{ this.start.getHours() }}h{{ this.start.getMinutes() }} -
        {{ this.end.getHours() }}h{{ this.end.getMinutes() }}

    </router-link>


</template>

<script>
export default {
    name: "DetailEventCard",
    props: {
        summary: String,
        start: Date,
        end: Date,
        location: String,
        height: Number,
        offsetY: Number,
    }
}
</script>

<style scoped lang="scss">

.event {
  position: absolute;
  border: 1px solid rgba(36, 238, 118, 0.82);
  border-radius: 5px;
  width: 100%;
  text-align: center;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  background: var(--color-background);
  transition: height 0.3s linear;
  color: var(--color-text);
  text-decoration: none;

  b {
    font-weight: 600;

  }

  &:hover {
    max-height: fit-content !important;
    transition: max-height 0.3s linear;
  }
}


</style>