
export const addinfo = (state) => {
    return {
        type: 'addinfo',
        state: state
    }
}
export const removeinfo = () => {
    return {
        type: 'removeinfo'
    }
}
export const updateinfo = (data) => {
    return {
        type: 'updateinfo',
        data: data
    }
}