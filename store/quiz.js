export const state = () => ({
    flashcard: {
        id: null,
        name: null,
        author: "anon",
        questions: []
    },
    progress: {
        running: false,
        userTranslation: "",
        randomQuestion: {},
        questionsLeft: [],
        questionsSkipped: []
    }
})

export const mutations = {
    SET_FLASHCARD(state, payload) {
        state.flashcard = payload;
    },
    SET_PROGRESS(state, payload) {
        state.progress = payload;
    },
    SET_RUNNING(state, payload) {
        state.progress.running = payload;
    },
    SET_USER_TRANSLATION(state, payload) {
        state.progress.userTranslation = payload;
    },
    SET_RANDOM_QUESTION(state, payload) {
        state.progress.randomQuestion = payload;
    },
    SET_QUESTIONS_LEFT(state, payload) {
        state.progress.questionsLeft = payload;
    },
    SET_QUESTIONS_SKIPPED(state, payload) {
        state.progress.questionsSkipped = payload;
    },
    TOGGLE_QUESTION_SKIPPED(state, payload) {
        state.progress.questionsSkipped.push(payload);
    },
    TOGGLE_QUESTION_ANSWERED(state, payload) {
        state.progress.questionsLeft = state.progress.questionsLeft.filter(e=>e.id!==payload.id);
    },
    RESET_QUIZ(state) {
        state.flashcard = {
            id: null,
            name: null,
            author: "anon",
            questions: []
        };

        state.progress = {
            running: false,
            userTranslation: "",
            randomQuestion: {},
            questionsLeft: [],
            questionsSkipped: []
        };
    }
}