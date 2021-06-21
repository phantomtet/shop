
export const addOpen = (state) => {
    return {
        type: 'addOpen',
        state: state
    }
}
export const removeOpen = (state) => {
    return {
        type: 'removeOpen',
        state: state
    }
}
export const addCollapse = (state) => {
    return {
        type: 'addCollapse',
        state: state
    }
}
export const removeCollapse = (state) => {
    return {
        type: 'removeCollapse',
        state: state
    }
}