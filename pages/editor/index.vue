<template>
  <div class="editor-wrapper">
    <header class="header pt-10 pb-15">
      <div class="header-content-container mx-auto">
        <div class="inner-header">
          <v-row>
            <v-col cols="10" class="text-align-left">
              <h1 class="text-lg-h3 text-h4 font-weight-black d-inline-block text-truncate" v-bind:style="$vuetify.breakpoint.smAndDown ? 'max-width: 225px' : ''">{{editor.flashcard.name || "Fiszka bez nazwy"}}</h1>
              <div class="subtitle-2 grey--text">
                <span class="font-weight-bold">Liczba pytań:</span> {{editor.flashcard.questions.length || "0"}}
                • <span class="font-weight-bold">Autor:</span> {{editor.flashcard.author}}
              </div>
              <div class="toolbar d-flex mt-4">
                <v-btn v-shortkey.once="['shift', 'a']" @shortkey="$nuxt.$emit('openAddQuestionDialog');" @click="$nuxt.$emit('openAddQuestionDialog');" color="black--text white" class="mr-2">
                  <v-icon class="mr-2">mdi-plus</v-icon>
                  Dodaj
                  <v-chip
                    class="ml-2"  
                    
                    color="black"
                    x-small
                  >
                    shift + a
                  </v-chip>
                </v-btn>
                <v-edit-dialog>
                  <v-btn color="black--text white"><v-icon>mdi-magnify</v-icon></v-btn>
                  <template v-slot:input>
                    <v-text-field v-model="search" label="Wyszukaj" prepend-inner-icon="mdi-magnify" single-line solo-inverted color="black"></v-text-field>
                  </template>
                </v-edit-dialog>
                <v-btn text v-if="editor.search.length" @click="$store.commit('editor/SEARCH', '');" class="ml-2" color="black--text white"><v-icon medium>mdi-close</v-icon></v-btn>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                     <v-btn v-on="on" class="ml-2" v-bind="attrs" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                  </template>
                  <v-list>
                    <v-list-item :disabled="editor.flashcard.questions.length < 2" @click="loadToQuiz">
                      <v-list-item-icon><v-icon>mdi-gamepad-square</v-icon></v-list-item-icon>
                      <v-list-item-title>Rozpocznij quiz</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showNameEditDialog" :disabled="selected.length>1">
                      <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
                      <v-list-item-title>Zmień nazwe</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showAuthorEditDialog">
                      <v-list-item-icon><v-icon>mdi-account-edit</v-icon></v-list-item-icon>
                      <v-list-item-title>Zmień autora</v-list-item-title>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item @click="download">
                      <v-list-item-icon><v-icon>mdi-download</v-icon></v-list-item-icon>
                      <v-list-item-title>Eksportuj</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeFromEditor">
                      <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
                      <v-list-item-title>Usuń</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </header>
    <v-container>
      <v-row justify="center">
        <v-col class="table" cols="10">
          <v-data-table :items-per-page=5 style="background-color: transparent;" v-model="selected" :headers="[{ text: 'Pytanie', value: 'question' }, { text: 'Odpowiedź', value: 'answer' }]" locale="pl" :items="editor.flashcard.questions" item-key="id" no-data-text="Brak pytań" :search="editor.search" no-results-text="Brak wyników" show-select>
            <template v-slot:top>
              <v-banner single-line style="top: 56px; border: none;" color="grey darken-3" sticky v-if="selected.length">
                <span class="body-2">
                  Wybrano: {{selected.length}}
                </span>
                <v-divider dark vertical></v-divider>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" small text v-on="on" :disabled="!selected.length">
                      Edytuj
                      <v-icon class="ml-2" small>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="editSelected" :disabled="selected.length>1">
                      <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
                      <v-list-item-title>Zmień</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="swapSelected">
                      <v-list-item-icon><v-icon>mdi-swap-horizontal</v-icon></v-list-item-icon>
                      <v-list-item-title>Zamień (pytanie z odpowiedzią)</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteSelected">
                      <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
                      <v-list-item-title>Usuń</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <template v-slot:actions="{ dismiss }">
                  <v-btn text small color="white" @click="dismiss; selected = []"><v-icon>mdi-close</v-icon></v-btn>
                </template>
              </v-banner>
              <div v-else style="height: 45px"></div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog-transition>
      <v-btn v-if="scrolled" @click="$nuxt.$emit('openAddQuestionDialog');" class="elevation-10" medium color="black--text white" fixed fab bottom right><v-icon>mdi-plus</v-icon></v-btn>
    </v-dialog-transition>
    <AddQuestionDialog/>
    <EditQuestionDialog/>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import fileDownload from "js-file-download";

export default {
  head: {
    title: `Fishka • Edytor`,
    meta: [{ hid: "description", name: "description", content: "Edytor" }]
  },
  components: {
    AddQuestionDialog: () => import("~/components/AddQuestionDialog"),
    EditQuestionDialog: () => import("~/components/EditQuestionDialog")
  },
  data() {
    return {
      selected: [],
      scrolled: false
    };
  },
  methods: {
    async showNameEditDialog() {
      let response = await this.$dialog.prompt({
        title: "Zmiana nazwy",
        textField: {
          filled: true,
          placeholder: this.editor.flashcard.name
        },
        actions: {
          false: "Anuluj",
          true: {
            text: "Edytuj",
            color: "white"
          }
        }
      });
      if(!response) return;

      this.$store.commit("editor/SET_FLASHCARD_NAME", response);
      this.saveAll();
    },
    async download() {
      var data = {
        id: this.editor.flashcard.id,
        author: this.editor.flashcard.author,
        name: this.editor.flashcard.name,
        questions: this.editor.flashcard.questions
      };

      fileDownload(JSON.stringify(data), `${this.editor.flashcard.name}.json`, 'application/json');
    },
    async showAuthorEditDialog() {
      let response = await this.$dialog.prompt({
        title: "Zmiana autora",
        textField: {
          filled: true,
          placeholder: this.editor.flashcard.author
        },
        actions: {
          false: "Anuluj",
          true: {
            text: "Edytuj",
            color: "white"
          }
        }
      });
      if(!response) return;

      this.$store.commit("editor/SET_FLASHCARD_AUTHOR", response);
      this.saveAll();
    },
    async loadToQuiz() {
      if(this.quiz.progress.running) {
        let response = await this.$dialog.confirm({
          text: `Quiz fiszki (${this.quiz.flashcard.name}) ciągle trwa, chcesz go zakończyć i rozpocząć nowy?`,
          actions: {
            false: "Nie",
            true: {
              text: "Zakończ",
              color: "red"
            }
          }
        });
          
        if(!response) return;
      }

      this.$store.commit("quiz/RESET_QUIZ");
      this.$store.commit("quiz/SET_FLASHCARD", this.editor.flashcard);
      this.$router.push("/quiz");
    },
    editSelected() {
      this.$nuxt.$emit('openEditQuestionDialog', this.selected[0]); 
      this.selected = [];
    },
    async deleteSelected() {
      let response = await this.$dialog.confirm({
        text: "Czy chcesz usunąć zaznaczone pytania?",
        actions: {
          false: "Anuluj",
          true: {
            text: "Usuń",
            color: "red"
          }
        }
      });

      if(!response) return;

      this.selected.forEach((element, index, array) => {
        this.$store.commit(
          "editor/REMOVE_FLASHCARD_QUESTION",
          element
        );
      });

      this.selected = [];
      this.saveAll();
    },
    swapSelected() {
      this.$store.commit("editor/INVERSE_FLASHCARD_QUESTIONS", this.selected);
      this.saveAll();
      this.selected = [];
    },
    saveAll() {
      this.$store.commit("storage/EDIT_FLASHCARD", {
        id: this.editor.flashcard.id,
        payload: this.editor.flashcard
      });
      this.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");
    },
    removeFromEditor() {
      this.$store.commit('storage/REMOVE_FLASHCARD', this.editor.flashcard.id);
      this.$store.commit('editor/RESET_FLASHCARD');
      this.$router.push('/dashboard'); 
      this.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");
    },
    handleScroll() {
      this.scrolled = window.scrollY > 240;
    }
  },
  mounted() {
    this.$store.dispatch("storage/GET_FLASHCARDS_FROM_STORAGE");
    if (this.$route.query.show == undefined && this.editor.flashcard.id == null && this.storage.flashcards.length > 0) {
      this.$router.push("/dashboard");
      return this.$dialog.warning({
        title: "Brak załadowanej fiszki",
        text: "Nie załadowałeś fiszki do edytora. Kliknij na stworzoną fiszkę i wciśnij przycisk 'Edytuj'.",
        actions: {
          true: "Okej"
        }
      });
    }
    if (this.editor.flashcard.id && !this.$route.query.show) {
      this.$router.push(`editor?show=${this.editor.flashcard.id}`);
    }
    if (this.$route.query.show) {
      let flashcardToLoad = this.storage.flashcards.filter(
        e => e.id == this.$route.query.show
      );
      this.$store.commit("editor/SET_FLASHCARD", flashcardToLoad[0]);
    }
    if (!this.storage.flashcards.length) {
      this.$router.push("/dashboard");
    }
  },
  beforeMount() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    search: {
      get() {
        return this.$store.state.editor.search;
      },
      set(val) {
        this.$store.commit('editor/SEARCH', val);
      }
    },
    ...mapState(["storage"]),
    ...mapState(["quiz"]),
    ...mapState(["editor"])
  }
};
</script>

<style scoped>
:root {
  color-scheme: dark;
}
.header {
  background-color: black;
  width: 100%;
}
.header-content-container {
  width: 78%;
}
</style>
