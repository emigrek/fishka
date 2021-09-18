export const state = () => ({
    flashcards: []
})

export const actions = {
    GET_FLASHCARDS_FROM_STORAGE({state, commit}) {
        var flashcards = localStorage.getItem("saved-flashcards");
        if(flashcards)
            commit('SET_FLASHCARDS', JSON.parse(flashcards));
    },
    FORCE_SAVE_FLASHCARDS_TO_STORAGE({state, commit}) {
        localStorage.setItem("saved-flashcards", JSON.stringify(state.flashcards));
    }
}

export const mutations = {
    SET_FLASHCARDS(state, items) {
        state.flashcards = items;
    },
    ADD_FLASHCARD(state, item) {
        var duplicates = state.flashcards.filter((e) => {
            if(e.code != null && e.code == item.code) {
                return e;
            }
            if(e.offlinecode != null && e.offlinecode == item.offlinecode) {
                return e;
            }
        });

        if(duplicates.length) {
            duplicates.forEach((element, index, array) => {
                state.flashcards.splice(state.flashcards.indexOf(element), 1, item);
            });
        } else {
            state.flashcards.push(item);
        }
    },
    REMOVE_FLASHCARD(state, item) {
        let without = state.flashcards.filter(i => i !== item);
        state.flashcards = without;
    }
}