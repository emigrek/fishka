<template>
  <v-app dark>
    <v-app-bar
      app
      color="black"
    >
      <v-toolbar-title @click="$router.push('/dashboard');" style="cursor: pointer; max-width: 55px;">
        <v-img eager src="/logo.png"/>
      </v-toolbar-title>
      <v-tabs color="white" hide-slider centered>
        <v-tab to="dashboard">
          <v-icon left>mdi-folder</v-icon>
          <span v-if="!this.$vuetify.breakpoint.smAndDown">Biblioteka</span>
        </v-tab>
        <v-tab :disabled="!storage.flashcards.length || editor.flashcard.id == null" to="editor">
          <v-icon left>mdi-pencil</v-icon>
          <span v-if="!this.$vuetify.breakpoint.smAndDown">Edytor</span>
        </v-tab>
        <v-tab :disabled="!quiz.flashcard.questions.length" to="quiz">
          <v-icon left>mdi-gamepad-square</v-icon>
          <span v-if="!this.$vuetify.breakpoint.smAndDown">Quiz</span>
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-main>
      <v-fade-transition>
        <nuxt />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "default",
  transition: 'fade',
  data () {
    return {
      title: "Fishka"
    }
  },
  mounted() {
    this.$store.dispatch("storage/GET_FLASHCARDS_FROM_STORAGE");
  },
  watch: {
    $route: function() {
      this.$store.dispatch("storage/GET_FLASHCARDS_FROM_STORAGE");
    }
  },
  computed: {
    route() {
      return this.$route.path
    },
    ...mapState(["storage"]),
    ...mapState(["quiz"]),
    ...mapState(["editor"])
  }
}
</script>

<style>
:root {
  color-scheme: dark;
}
body {
  overflow-y: auto;
}
html { 
  overflow-y: auto;
  scroll-behavior: smooth; 
}
</style>