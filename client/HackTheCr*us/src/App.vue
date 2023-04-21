<template>
    <main>
        <div id="nav">
            <router-link to="/">Home</router-link>
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Register</router-link>
        </div>
        <div id="content">
            <router-view/>
        </div>
    </main>
</template>

<script>

</script>

<style scoped lang="scss">
    main{
        width:100%;
        padding: 0px;
        margin:0px;
        display:flex;
        flex-direction: row;
    }
    #nav{
        width:8%;
        display:flex;
        flex-direction: column;
        justify-content: center;
        height:100dvh;
        position:fixed;
        padding-left:2%;
        background:#0C0C0C;
        a{
            color : rgba(255, 255, 255, 0.75);
            font-family: Inter,sans-serif;
            font-size:25px;
            text-decoration: none;
            &.router-link-active{
                color: #63F49E;
            }
        }
    }
    #content{
        margin-top: 30px;
        width:90%;
        margin-left:10%;
    }
</style>