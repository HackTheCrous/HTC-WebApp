<template>
    <svg :width="size" :height="size" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
                d="M11.6666 37.5001V22.2501C10.25 21.8612 9.06218 21.0834 8.10329 19.9167C7.14441 18.7501 6.66552 17.389 6.66663 15.8334V4.16675H9.99996V15.8334H11.6666V4.16675H15V15.8334H16.6666V4.16675H20V15.8334C20 17.389 19.5205 18.7501 18.5616 19.9167C17.6027 21.0834 16.4155 21.8612 15 22.2501V37.5001H11.6666ZM28.3333 37.5001V24.1667H23.3333V12.5001C23.3333 10.1945 24.1461 8.22897 25.7716 6.60342C27.3972 4.97786 29.3622 4.16564 31.6666 4.16675V37.5001H28.3333Z"
                :fill-opacity="opacity"/>
    </svg>
</template>
<script>
export default {
    name: 'restaurant',
    props: {
        color: String,
        opacity: String,
        size: String
    }
}
</script>
<style scoped lang="scss">
@import "@/styles/icons.scss";

</style>