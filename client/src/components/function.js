import {firestore } from '../firebase'
export const addNotify = (from, to, data) => {
    if (from !== to) {
        const newNoti = firestore.collection('users').doc(to).collection('notification').doc()
        // create a notify for comment
        newNoti.set(data).then(() => firestore.collection('users').doc(to).update({newNoti: true}))
    }
}
export const timeFormat = (time) => {           //time la tgian tinh bang mili giay
    let timelapse = Math.floor((Date.now() - time)/1000)
    if (timelapse >= 60) {
        timelapse/=60
        if (timelapse >= 60) {
            timelapse/=60
            if (timelapse >= 24) {
                timelapse/=24
                if (timelapse >=7) {
                    timelapse/=7
                    return `${Math.floor(timelapse)} week ago`
                }
                else return `${Math.floor(timelapse)} day ago`
            }
            else return `${Math.floor(timelapse)} hour ago`
        }
        else return `${Math.floor(timelapse)} minute ago`
    }
    else return `${Math.floor(timelapse)} second ago`
}
