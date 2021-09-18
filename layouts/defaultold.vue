<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      hide-overlay
      permanent
      app
      :clipped="true"
      color="grey darken-4"
    >
      <v-list dense nav>
        <v-list-item-group>
          <v-list-item to="/dashboard" router exact>
            <v-list-item-action>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action-text class="mr-3 mt-1">
              {{storage.flashcards.length}}
            </v-list-item-action-text>
          </v-list-item>
          <v-list-item :disabled="!storage.flashcards.length" to="/editor" router>
            <v-list-item-action>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Edytor</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
      fixed
      color="black"
    >
      <v-app-bar-nav-icon @click.stop="mini = !mini" />
      <v-toolbar-title class="font-medium-bold" v-text="title" />
      <v-spacer/>
      <v-fade-transition>
        <v-text-field solo v-model="search" flat hide-details v-if="route == '/editor'" label="Wyszukaj w Edytor" prepend-inner-icon="mdi-magnify"></v-text-field>
      </v-fade-transition>
      <v-spacer/>
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
  data () {
    return {
      drawer: true,
      overrideMini: false,
      searchInput: false,
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
    mini: {
      get() {
        return this.$vuetify.breakpoint.mdAndDown || this.overrideMini;
      },
      set(value) {
        this.overrideMini = value;
      }
    },
    search: {
      get() {
        return this.$store.state.editor.search;
      },
      set(val) {
        this.$store.commit("editor/SEARCH", val);
      }
    },
    route() {
      return this.$route.path
    },
    ...mapState(["storage"]),
    ...mapState(["editor"])
  }
}
</script>
