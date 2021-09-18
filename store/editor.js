import { nanoid } from 'nanoid';

export const state = () => ({
    flashcard: {
        id: null,
        name: null,
        author: "anon",
        questions: []
    },
    search: ""
})

export const actions = {
    GET_QUESTION_BY_ID(state, id) {
        return state.flashcard.questions.find(question => question.id === id);
    }
};

export const mutations = {
    SET_FLASHCARD(state, payload) {
        state.flashcard = payload;
    },
    SET_FLASHCARD_NAME(state, payload) {
        state.flashcard.name = payload;
    },
    SET_FLASHCARD_QUESTIONS(state, payload) {
        state.flashcard.questions = payload;
    },
    ADD_FLASHCARD_QUESTION(state, payload) {
        state.flashcard.questions.push({ id: nanoid(4).toLocaleLowerCase(), question: payload.question, answer: payload.answer});
    },
    EDIT_FLASHCARD_QUESTION(state, { oldq, newq }) {
        state.flashcard.questions.splice(state.flashcard.questions.indexOf(oldq), 1, newq);
    },
    SET_FLASHCARD_AUTHOR(state, payload) {
        state.flashcard.author = payload;
    },
    INVERSE_FLASHCARD_QUESTIONS(state, payload) {
        payload.forEach((item, index, array) => {
            var inversed = { id: item.id, question: item.answer, answer: item.question };
            state.flashcard.questions.splice(state.flashcard.questions.indexOf(item), 1, inversed);
        });  
    },
    REMOVE_FLASHCARD_QUESTION(state, payload) {
        let without = state.flashcard.questions.filter(e => e !== payload);
        state.flashcard.questions = without;
    },
    SEARCH(state, payload) {
        state.search = payload;
    },
    RESET_FLASHCARD(state) {
        state.flashcard = {
            id: null,
            name: null,
            questions: [],
            author: "anon"
        };
    },
}