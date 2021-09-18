export const state = () => ({
    running: false,
    loading: true,
    progressProcentDone: 0,
    progressTitle: "",
    translation: "",
    code: null,
    offlinecode: null,
    name: undefined,
    questions: [],
    searched: null,
    questionsToGuess: null,
    questionsLeft: null,
    guess: {}
})

export const actions = {
    async GET_FLASHCARD_FROM_CODE({state, commit}, random) {
        let checkResponse = await this.$axios({
            method: 'get',
            url: `https://jsonbox.io/box_58ba2d05f91a11b9bdce/${random}`,
            headers: {'content-type': 'application/json'}
        });
        if (checkResponse.data.length == 0) return { taken: false, message: "Kod nie jest zajęty" };
        else return {taken: true, name: checkResponse.data[0].name, questions: checkResponse.data[0].questions};
    },
    async SAVE_FLASHCARD_TO_CODE({state, commit}, random) {
        if (random.length != 6) return {error: true, message: 'Niepoprawna długość kodu'};

        let checkResponse = await this.$axios({
            method: 'post',
            url: `https://jsonbox.io/box_58ba2d05f91a11b9bdce/${random}`,
            headers: {'content-type': 'application/json'},
            data: { name: state.name, questions: state.questions }
        });

        if (checkResponse.status == 200) {
            commit('SET_CODE', random);
            return {error: false, message: "Kod został wygenerowany", shareCode: random };
        }
    }
}

export const mutations = {
    SET_CODE(state, c) {
        state.code = c;
    },
    SET_OFFLINE_CODE(state, c) {
        state.offlinecode = c;
    },
    SET_PROGRESS_PROCENT(state, d) {
        state.progressProcentDone = d;
    },
    SET_PROGRESS_TITLE(state, d) {
        state.progressTitle = d;
    },
    SET_TRANSLATION(state, d) {
        state.translation = d;
    },
    SET_RUNNING(state, d) {
        state.running = d;
    },
    SET_LOADING(state, d) {
        state.loading = d;
    },
    SET_QUESTIONS(state, q) {
        state.questions = q;
    },
    SET_SEARCHED(state, s) {
        state.searched = s;
    },
    SET_QUESTIONS_TO_GUESS(state, q) {
        state.questionsToGuess = q;
    },
    SET_QUESTIONS_LEFT(state, q) {
        state.questionsLeft = q;
    },
    SET_NAME(state, name) {
        state.name = name;
    },
    EDIT_QUESTION(state, payload) {
        state.questions.splice(state.questions.indexOf(payload.oldq), 1, payload.newq);
    },
    INVERSE_QUESTIONS(state, payload) {
        payload.forEach((item, index, array) => {
            var inversed = { question: item.answer, answer: item.question };
            state.questions.splice(state.questions.indexOf(item), 1, inversed);
        });  
    },
    ADD_QUESTION(state, q) {
        if (q.question && q.answer) {
            state.questions.push(q);
        }
    },
    REMOVE_QUESTION(state, q) {
        let without = state.questions.filter(item => item !== q);
        state.questions = without;
    },
    TOGGLE_ANSWERED(state, q) {
        let without = state.questionsLeft.filter(item => item !== q);
        state.questionsLeft = without;
    },
    SET_GUESS(state, q) {
        state.guess = q;
    },
    SET_STATE(state, newstate) {
        state.name = newstate.name;
        state.offlinecode = newstate.offlinecode;
        state.questions = newstate.questions;
        state.code = newstate.code;
    },
    RESET(state) {
        state.running = false;
        state.loading = true;
        state.progressProcentDone = 0;
        state.progressTitle = "";
        state.translation = "";
        state.name = undefined;
        state.offlinecode = null;
        state.questions = [];
        state.searched = null;
        state.questionsToGuess = null;
        state.questionsLeft = null;
        state.code = null;
        state.guess = {};
    }
}