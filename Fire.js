import { initializeApp } from 'firebase/app';
import { 
    initializeAuth, 
    getReactNativePersistence, 
    onAuthStateChanged, 
    signInAnonymously 
} from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCEJLoYF_vMrlO_PQAr--RKQUhLw9IM2e4",
    authDomain: "myapp-1026d.firebaseapp.com",
    projectId: "myapp-1026d",
    storageBucket: "myapp-1026d.firebasestorage.app",
    messagingSenderId: "134203440915",
    appId: "1:134203440915:web:d838cdce764c416bdea4e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use initializeAuth for persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

class Fire {
    constructor(callback) {
        this.init(callback);
    }

    init(callback) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                callback(null, user);
            } else {
                signInAnonymously(auth)
                    .catch((error) => {
                        callback(error);
                    });
            }
        });
    }

    getLists(callback) {
        const ref = collection(doc(db, 'users', this.userId), 'lists');

        this.unsubscribe = onSnapshot(ref, (snapshot) => {
            const lists = [];

            snapshot.forEach((doc) => {
                lists.push({ id: doc.id, ...doc.data() });
            });

            callback(lists);
        });
    }

    get userId() {
        return auth.currentUser ? auth.currentUser.uid : null;
    }
}

export default Fire;
