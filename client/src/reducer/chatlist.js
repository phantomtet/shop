const initialState = {
    open: [],
    collapse: []
}
export const chatlist = (state = initialState, action) => {
    switch (action.type) {
        case 'addOpen':
            return {
                open: [...state.open, action.state],
                collapse: state.collapse,
            }
        case 'removeOpen':
            return {
                open: state.open.filter(elem => elem != action.state),
                collapse: state.collapse,
            }
        case 'addCollapse':
            return {
                open: state.open,
                collapse: [...state.collapse, action.state],
            }
        case 'removeCollapse':
            return {
                open: state.open,
                collapse: state.collapse.filter(elem => elem != action.state)
            }
        default:
            return state
    }
}