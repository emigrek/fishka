export const state = () => ({
    enabled: true
})

export const mutations = {
    TOGGLE_NOTIFICATIONS(state, i) {
        state.enabled = i;
    }
}