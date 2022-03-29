import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"

/* Firebase configuration */
const firebaseConfig = {
    apiKey: "AIzaSyCYUwqnS5YPfffDEVrqTvX5Vyc4djfGwXg",
    authDomain: "rftb-project-3.firebaseapp.com",
    projectId: "rftb-project-3",
    storageBucket: "rftb-project-3.appspot.com",
    messagingSenderId: "705453625079",
    appId: "1:705453625079:web:f37c1d820c6e39569c0df2"
}

/* Initialize app */
initializeApp(firebaseConfig)

export const db = getFirestore()