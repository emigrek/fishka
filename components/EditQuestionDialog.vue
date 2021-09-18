<template>
    <v-dialog max-width="400px" retain-focus v-model="visible">
      <v-card>
        <v-card-title>Edytuj pytanie</v-card-title>
        <v-card-text>
            <v-text-field autofocus color="primary" v-model="newq.question" label="Pytanie" filled></v-text-field>
            <v-text-field color="primary" v-model="newq.answer" label="Odpowiedź" filled></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="visible = false; newq.question = ''; newq.answer = '';" text>Anuluj</v-btn>
          <v-btn @click="editFlashcard" color="white" text>Edytuj</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "EditQuestionDialog",
    data() {
        return {
            visible: false,
            oldq: {
                question: '',
                answer: '',
                id: null
            },
            newq: {
                question: '',
                answer: ''
            }
        };
    },
    methods: {
        editFlashcard() {
            this.$store.commit("editor/EDIT_FLASHCARD_QUESTION", {
                oldq: this.oldq,
                newq: {
                    id: this.oldq.id,
                    question: this.newq.question,
                    answer: this.newq.answer
                }
            });

            this.$store.commit("storage/EDIT_FLASHCARD", {
                id: this.editor.flashcard.id,
                payload: this.editor.flashcard
            });
            this.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");

            this.visible = false;
        }
    },
    created() {
        this.$nuxt.$on("openEditQuestionDialog", (payload) => {
            this.oldq = payload;
            this.visible = true;
        });
    },
    beforeDestroy() {
        this.$nuxt.$off("openEditQuestionDialog");
    },
    computed: {
        ...mapState(["storage"]),
        ...mapState(["editor"])
    }
};
</script>