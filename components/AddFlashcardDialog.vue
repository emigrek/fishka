<template>
    <v-dialog max-width="400px" retain-focus v-model="visible">
      <v-card>
        <v-card-title>Nowa fiszka</v-card-title>
        <v-card-text>
            <v-text-field autofocus placeholder="np. Angielski - Unit 6" color="primary" v-model="name" label="Nazwa" filled></v-text-field>
            <v-text-field placeholder="np. ja" color="primary" v-model="author" label="Autor" filled></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="visible = false; name = ''; author = '';" text>Anuluj</v-btn>
          <v-btn @click="addFlashcard" color="white" text>Dodaj</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "AddFlashcardDialog",
    data() {
        return {
            visible: false,
            name: '',
            author: ''
        };
    },
    methods: {
        addFlashcard() {
            this.$store.commit("storage/ADD_FLASHCARD", { name: this.name, author: this.author, questions: [] });
            this.$store.dispatch("storage/SAVE_FLASHCARDS_TO_STORAGE");

            this.name = '';
            this.author = '';
            this.visible = false;
        }
    },
    created() {
        this.$nuxt.$on("openAddFlashcardDialog", () => {
            this.visible = true;
        });
    },
    beforeDestroy() {
        this.$nuxt.$off("openAddFlashcardDialog");
    },
    computed: {
        ...mapState(["storage"]),
        ...mapState(["editor"])
    }
};
</script>