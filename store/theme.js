export const state = () => ({
    name: "is-primary",
    themeList: [
        { name: "Niebieski", type: "is-info"},
        { name: "Czarny", type: "is-black"},
        { name: "Ciemny", type: "is-dark"},
        { name: "Fioletowy", type: "is-primary"}
    ]
})

export const mutations = {
    SET_THEME(state, name) {
        state.name = name;
    }
}