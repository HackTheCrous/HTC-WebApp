<template>
    <h1>Vue Login</h1>
    <section id="register">
        <main>
            <form>
                <h2>Bienvenue !</h2>
                <h4>Bienvenue ! Entrez vos informations pour rejoindre hack the cr*us</h4>
                <div>
                    <label for="mail">Email</label>
                    <input type="email" name="mail" id="mail" placeholder="Entrez votre mail"/>
                </div>
                <div>
                    <label for="password">Mot de passe</label>
                    <input type="password" name="password" id="password" placeholder="Entrez votre mot de passe"/>
                </div>


                <button>Se connecter</button>
                <span>
                    <p>Vous n'avez pas de compte ?</p> <router-link to="/register">Inscrivez-vous</router-link>
                </span>
            </form>
        </main>
        <aside>
            <div id="sun">
                <div id="round"></div>
                <div id="sea"></div>
            </div>
        </aside>
    </section>
</template>

<script>
export default {
    name: "Login"
}
</script>

<style scoped lang="scss">
@import '@/styles/login.scss';

</style>