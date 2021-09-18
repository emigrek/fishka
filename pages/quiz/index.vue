<template>
  <div class="editor-wrapper">
    <header class="header pt-10 pb-15">
      <div class="header-content-container">
        <transition name="flipFlashcard" mode="out-in">
          <div class="flashcard" @click="upsideDown" :key="flashcardSide">
              <v-sheet class="mx-auto clickable nonselectable rounded-xl d-flex align-center" color="white" width="25rem" height="12rem">
                <div class="flashcard-text black--text text-h4 ml-3">
                  {{(flashcardSide) ? quiz.progress.randomQuestion.answer : quiz.progress.randomQuestion.question}}
                </div>
              </v-sheet>
          </div>
        </transition>
      </div>
    </header>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="4" md="6" sm="8">
          <v-card loading>
            <template v-slot:progress>
              <v-progress-linear :value="Math.ceil(100 - (quiz.progress.questionsLeft.length/quiz.flashcard.questions.length)*100)" color="white">
              </v-progress-linear>
            </template>
            <v-card-title>
              <v-text-field autofocus :disabled="!control" v-model="translation" color="white" filled label="Odpowiedź" counter/>
            </v-card-title>
            <v-card-text class="text-center">
              <v-btn text @click="generateRandomQuestion(); dice = dices[Math.floor(Math.random() * dices.length)];"><v-icon class="mr-2" small>{{ dice }}</v-icon> Losuj</v-btn>
              <v-btn text @click="abort();">Przerwij quiz <v-icon class="ml-2" small>mdi-close</v-icon></v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay color="#000" opacity="0.9" :value="loading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  head: {
    title: `🎮 Fishka • Quiz`,
    meta: [{ hid: "description", name: "description", content: "Quiz" }]
  },
  data() {
    return {
      loading: true,
      control: true,
      flashcardSide: 0,
      dice: "mdi-dice-6",
      dices: ["mdi-dice-1", "mdi-dice-2", "mdi-dice-3", "mdi-dice-4", "mdi-dice-5", "mdi-dice-6"]
    };
  },
  methods: {
    init() {
      this.$store.commit("quiz/SET_QUESTIONS_LEFT", this.quiz.flashcard.questions);
      this.$store.commit("quiz/SET_RUNNING", true);
      this.generateRandomQuestion();
    },
    finish() {
      this.$store.commit("quiz/RESET_QUIZ");
      this.$router.push("/dashboard");
      this.$toast(`Ukończyłeś quiz, gratulacje! 👏`, {
        timeout: 5000
      })
    },
    handleTranslation(e) {
      this.$store.commit("quiz/SET_USER_TRANSLATION", e);

      if(this.quiz.progress.randomQuestion.answer == this.quiz.progress.userTranslation) {        
        this.$store.commit("quiz/TOGGLE_QUESTION_ANSWERED", this.quiz.progress.randomQuestion);
        this.$store.commit("quiz/SET_USER_TRANSLATION", "");
        if(!this.generateRandomQuestion()) return this.finish();
      }
    },
    upsideDown() {
      this.flashcardSide = !this.flashcardSide;
      this.control = false;

      setTimeout(() => {
        this.flashcardSide = !this.flashcardSide;
        setTimeout(() => {
          this.control = true;
          this.generateRandomQuestion();
        });
      }, 1500);
    },
    generateRandomQuestion() {
      if(this.quiz.progress.questionsLeft.length>0) {
        let randomQuestion = this.quiz.progress.questionsLeft[Math.floor(Math.random() * this.quiz.progress.questionsLeft.length)];
        this.$store.commit("quiz/SET_RANDOM_QUESTION", randomQuestion);
        return 1;
      } else {
        return 0;
      }
    },
    abort() {
      this.$store.commit("quiz/RESET_QUIZ");
      this.$router.push("/dashboard");
      this.$toast(`Przerwano quiz na twoje życzenie. 👊`);
    }
  },
  mounted() {
    if(this.quiz.flashcard.id == null) {
      this.$toast(`Rozpocznij quiz z edytora lub dashboardu. 😺`, { timeout: 5000 });
      this.$router.push('/dashboard');
    }

    if(!this.quiz.progress.running)
      this.init();

    this.loading = false;
  },
  computed: {
    translation: {
      set(e) {
        this.handleTranslation(e);
      },
      get() {
        return this.quiz.progress.userTranslation;
      }
    },
    ...mapState(["quiz"])
  }
};
</script>

<style scoped>
.header {
  background-color: black;
  width: 100%;
}
</style>
