import { db } from './config';
import { collection, getDocs, addDoc } from 'firebase/firestore'

class Firestore {
    constructor() {
        this.productsCollection = collection(db, 'products');
        this.ordersCollections = collection(db, 'orders');
    }

    async getAllProducts() {
        const snapshot =  await getDocs(this.productsCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async getAllOrders() {
        const snapshot = await getDocs(this.ordersCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    //other crud methods add here
    //filtered product methods could go here (filter using params?)
}

export default Firestore