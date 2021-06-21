import firebase from 'firebase'
import 'firebase/firestore'


const firebaseConfig2 = {
    apiKey: "AIzaSyDOyd9uMTGsFAIthJa-zkyyK5wqU9qtERY",
    authDomain: "facebook-87300.firebaseapp.com",
    projectId: "facebook-87300",
    storageBucket: "facebook-87300.appspot.com",
    messagingSenderId: "93684704070",
    appId: "1:93684704070:web:cc7dbfbe54fd28befabb47",
    measurementId: "G-B7YDM3KTXG"
};
var firebaseConfig = {
  apiKey: "AIzaSyAlrl8oPDKTSxa64q5Q1cSD_j7f863kdZ0",
  authDomain: "https://fakebook123.netlify.app",
  projectId: "fakebook2-1953a",
  storageBucket: "fakebook2-1953a.appspot.com",
  messagingSenderId: "224349683584",
  appId: "1:224349683584:web:99ced44eaf10734f754b65",
  measurementId: "G-L0DVS032V9"
};
firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export default firebase