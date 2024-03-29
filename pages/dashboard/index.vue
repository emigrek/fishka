<template>
  <v-container>
    <div class="my-2">
      <div class="d-flex mb-4">
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
        <v-btn class="ml-auto" color="white" outlined @click="deleteAll">
          <v-icon
            left
          >
            mdi-delete
          </v-icon>
          Wyczyść
        </v-btn>
      </div>
      <v-divider class="mx-4"></v-divider>
    </div>
    <v-row class="pt-2" align="center">
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
        <v-card flat color="grey darken-4" elevation="15">
          <v-app-bar flat color="grey darken-4">
            <v-toolbar-title>
              {{flashcard.name}}
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip v-bind="attrs" v-on="on" color="grey darken-4" text-color="blue" v-if="flashcard.builtin"><v-icon>mdi-memory</v-icon></v-chip>
                </template>
                <span>Fiszka wbudowana</span>
              </v-tooltip>
            </v-toolbar-title>
            <v-spacer/>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" :disabled="flashcard.questions.length < 2" @click="loadToQuiz(flashcard)" icon><v-icon>mdi-gamepad-square</v-icon></v-btn>
              </template>
              <span>Quiz</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" @click="$router.push(`/editor?show=${flashcard.id}`);" icon><v-icon>mdi-pencil</v-icon></v-btn>
              </template>
              <span>Edytuj</span>
            </v-tooltip>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs" icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
              </template>
              <v-list>
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
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
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
  components: {
    AddFlashcardDialog: () => import("~/components/AddFlashcardDialog")
  },
  data() {
    return {
      dialog: false,
      builtin: ['UNIT1.json', 'UNIT2.json', 'UNIT4.json', 'UNIT5.json']
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
        multiple: true
      };

      const filePromise = pickFile(options);

      try {
        const files = await filePromise;
        if(files.length) {
          for(let i=0; i<files.length; i++) {
            this.readFlashcardFile(files[i]);
          }
        }
        this.$dialog.notify.success('Pomyślnie zaimportowano!', {
          position: 'bottom-right',
          timeout: 2000
        })
      } catch (e) {
        this.$dialog.notify.error('Coś poszło nie tak przy importowaniu!', {
          position: 'bottom-right',
          timeout: 2000
        })
        return e;
      }
    },
    readFlashcardFile(file) {
      var reader = new FileReader();
      var that = this;

      reader.readAsText(file, "UTF-8");
      
      reader.onload = function (evt) {
          var flashcard = JSON.parse(evt.target.result);
          if(!flashcard.id) return;

          that.$store.commit("storage/ADD_FLASHCARD", flashcard);
          that.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");
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
      if(this.storage.flashcards.length==0) return;

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

    if(!this.storage.flashcards.length) {
      this.builtin.forEach(async item => {
        var data = await fetch(`/builtin/${item}`);
        var flashcard = await data.json();
        flashcard.builtin = true;

        this.$store.commit("storage/ADD_FLASHCARD", flashcard);
        this.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");
      });
    }
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