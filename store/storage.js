import { nanoid } from 'nanoid';

const STORAGE_NAME = "fishka_flashcards";


export const state = () => ({
    flashcards: []
})

export const mutations = {
    SET_FLASHCARDS(state, payload) {
        state.flashcards = payload;
    },
    ADD_FLASHCARD(state, payload) {
        if(!payload.id) payload.id = nanoid(6).toLocaleLowerCase();
        state.flashcards.push(payload);
    },
    REMOVE_FLASHCARD(state, id) {
        let without = state.flashcards.filter(flashcard => flashcard.id !== id);
        state.flashcards = without;
    },
    EDIT_FLASHCARD(state, { id, payload }) {
        state.flashcards.splice(state.flashcards.indexOf(GET_FLASHCARD_BY_ID(state, id)), 1, payload);
    }
}

export const actions = {
    SAVE_FLASHCARDS_TO_STORAGE({state, commit}) {
        localStorage.setItem(STORAGE_NAME, JSON.stringify(state.flashcards));
    },
    GET_FLASHCARDS_FROM_STORAGE({state, commit}) {
        var flashcards = localStorage.getItem(STORAGE_NAME);
        if(flashcards)
            commit('SET_FLASHCARDS', JSON.parse(flashcards));
    }
}

function GET_FLASHCARD_BY_ID(state, id) {
    return state.flashcards.find(flashcard => flashcard.id === id);
}