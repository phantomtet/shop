const tab = (state = 'Home', actions) => {
    if (actions) return actions.type
    else return state

}
export default tab