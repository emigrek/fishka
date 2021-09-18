<template>
  <v-container>
    <v-banner style="top: 55px;" class="mb-2" single-line sticky>
      <div class="pb-2">
        <v-btn color="black--text white" @click="$nuxt.$emit('openAddFlashcardDialog')" class="mr-2">
          <v-icon
            left
          >
            mdi-plus
          </v-icon>
          Dodaj
        </v-btn>
        <v-btn color="black--text white" @click="upload" class="mr-2">
          <v-icon
            left
          >
            mdi-upload
          </v-icon>
          Importuj
        </v-btn>
        <v-btn color="white" outlined @click="deleteAll">
          <v-icon
            left
          >
            mdi-delete
          </v-icon>
          Usuń wszystkie
        </v-btn>
      </div>
    </v-banner>
    <v-row align="center">
      <v-col v-if="storage.flashcards.length == 0" cols="12" class="text-center body-2 mt-2 grey--text">
        <v-icon color="grey" class="huge">mdi-cards</v-icon>
        <br/>
        <p>
          Nie dodałeś jeszcze żadnej fiszki.
          <br/>
          Tutaj pojawią się fiszki które są zapisane na urządzeniu.
        </p>
      </v-col>
      <v-col v-for="flashcard in storage.flashcards" :key="flashcard.id" cols="12" xs="12" sm="12" md="6" lg="3">
        <v-card color="grey darken-4" flat>
          <v-app-bar flat color="rgba(0,0,0,0)">
            <v-toolbar-title>{{flashcard.name}}</v-toolbar-title>
            <v-spacer/>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs" small icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list>
                <v-list-item @click="$router.push(`/editor?show=${flashcard.id}`);">
                  <v-list-item-icon><v-icon>mdi-pencil</v-icon></v-list-item-icon>
                  <v-list-item-title>Edytuj</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="flashcard.questions.length < 2" @click="loadToQuiz(flashcard)">
                  <v-list-item-icon><v-icon>mdi-gamepad-square</v-icon></v-list-item-icon>
                  <v-list-item-title>Quiz</v-list-item-title>
                </v-list-item>
                <v-list-item @click="download(flashcard)">
                  <v-list-item-icon><v-icon>mdi-download</v-icon></v-list-item-icon>
                  <v-list-item-title>Eksportuj</v-list-item-title>
                </v-list-item>
                <v-list-item  @click="removeFlashcard(flashcard.id); $store.dispatch('storage/SAVE_FLASHCARDS_TO_STORAGE');">
                  <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
                  <v-list-item-title>Usuń</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-app-bar>
          <v-card-text>
            <span class="font-weight-medium">Identyfikator:</span> {{ flashcard.id }}
            <v-spacer/>
            <span class="font-weight-medium">Ilość pytań:</span> {{ flashcard.questions.length}}
            <v-spacer/>
            <span class="font-weight-medium">Autor:</span> {{ flashcard.author}}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <AddFlashcardDialog/>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import fileDownload from "js-file-download";
import { pickFile } from 'js-pick-file';

export default {
  head: {
    title: `Fishka • Dashboard`,
    meta: [{ hid: "description", name: "description", content: "Dashboard" }],
  },
  components: {
    AddFlashcardDialog: () => import("~/components/AddFlashcardDialog")
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    async loadToQuiz(item) {
      if(this.quiz.progress.running) {
        let response = await this.$dialog.confirm({
          text: "Quiz ciągle trwa, chcesz go zakończyć i rozpocząć nowy?",
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
      this.$store.commit("quiz/SET_FLASHCARD", item);
      this.$router.push("/quiz");
    },
    async download(flashcard) {
      var data = {
        id: flashcard.id,
        author: flashcard.author,
        name: flashcard.name,
        questions: flashcard.questions
      };

      fileDownload(JSON.stringify(data), `${flashcard.name}.json`, 'application/json');
    },
    async upload() {
      var options = {
        accept: '.json',
        multiple: false
      };
      var that = this;

      const filePromise = pickFile(options);

      try {
        const file = await filePromise;

        if(file[0]) {
          var reader = new FileReader();
          reader.readAsText(file[0], "UTF-8");
          reader.onload = function (evt) {
            var flashcard = JSON.parse(evt.target.result);
            that.$store.commit("storage/ADD_FLASHCARD", flashcard);
            that.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");
          }
          reader.onerror = function (evt) {
            this.$toast("Wystąpił błąd podczas czytania pliku!");
          }
        }
      } catch (e) {
        return e;
      }
    },
    async deleteAll() {
      let response = await this.$dialog.confirm({
        text: "Czy chcesz usunąć wszystkie fiszki?",
        actions: {
          false: "Anuluj",
          true: {
            text: "Usuń",
            color: "red"
          }
        }
      });

      if(!response) return;
      if(this.storage.flashcards.length==0)
        return this.$toast("Brak pozycji do usunięcia. 🙃");

      this.$store.commit("storage/SET_FLASHCARDS", []);
      this.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");
    },
    close() {
      this.dialog = false;
    },
    ...mapMutations({
      removeFlashcard: "storage/REMOVE_FLASHCARD",
    }),
  },
  mounted() {
    this.$store.dispatch("storage/GET_FLASHCARDS_FROM_STORAGE");
  },
  computed: {
    ...mapState(["storage"]),
    ...mapState(["quiz"])
  },
};
</script>

<style>
.huge {
  font-size: 96px !important;
}
</style>