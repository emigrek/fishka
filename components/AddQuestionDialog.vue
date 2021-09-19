<template>
    <v-dialog max-width="400px" retain-focus v-model="visible">
      <v-card>
        <v-card-title>Nowe pytanie</v-card-title>
        <v-card-text>
            <v-text-field autofocus placeholder="np. 2*2+2" color="primary" v-model="question" label="Pytanie" filled></v-text-field>
            <v-text-field placeholder="np. 6" color="primary" v-model="answer" label="Odpowiedź" filled></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="visible = false; question = ''; answer = '';" text>Anuluj</v-btn>
          <v-btn @click="addQuestion" color="white" text>Dodaj</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "AddQuestionDialog",
    data() {
        return {
            visible: false,
            question: '',
            answer: ''
        };
    },
    methods: {
        addQuestion() {
            this.$store.commit("editor/ADD_FLASHCARD_QUESTION", {
                question: this.question,
                answer: this.answer
            });

            this.$store.commit("storage/EDIT_FLASHCARD", {
                id: this.editor.flashcard.id,
                payload: this.editor.flashcard
            });


            //this.$toast("Dodano nowe pytanie. 👋");
            this.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");

            this.question = '';
            this.answer = '';
            this.visible = false;
        }
    },
    created() {
        this.$nuxt.$on("openAddQuestionDialog", () => {
            this.visible = true;
        });
    },
    beforeDestroy() {
        this.$nuxt.$off("openAddQuestionDialog");
    },
    computed: {
        ...mapState(["storage"]),
        ...mapState(["editor"])
    }
};
</script>