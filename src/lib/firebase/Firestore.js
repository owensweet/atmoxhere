import { db } from './config';
import { collection, getDocs, addDoc, query, where, limit, updateDoc, doc, increment } from 'firebase/firestore'

class Firestore {
    constructor() {
        this.productsCollection = collection(db, 'products');
        this.ordersCollection = collection(db, 'orders');
    }

    async getAllProducts() {
        try {
            const snapshot = await getDocs(this.productsCollection);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching all products:', error);
            throw error;
        }
    }

    async getAllOrders() {
        try {
            const snapshot = await getDocs(this.ordersCollection);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw error;
        }
    }

    // Use query to search
    async getProductBySlug(slug) {
        try {
            const q = query(
                this.productsCollection,
                where('slug', '==', slug),
                limit(1)
            );
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                return null;
            }
            
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        } catch (error) {
            console.error('Error fetching product by slug:', error);
            throw error;
        }
    }

    // Get the firestore product by the stripe priceId that is the priceId field on firestore
    async getProductByPriceId(priceId) {
        try {
            const q = query(
                this.productsCollection,
                where('priceID', '==', priceId),
                limit(1)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return null;
            }

            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        } catch (error) {
            console.error("Error fetching product by priceID: ", error)
            throw error;
        }
    }

    // Decrement the stock when an item is purchased
    async decrementStock(priceId, quantity) {
        try {
            const product = await this.getProductByPriceId(priceId);
            
            if (!product) {
                console.warn(`No product found for priceId: ${priceId}`);
                return false;
            }

            const productRef = doc(this.productsCollection, product.id);
            await updateDoc(productRef, {
                stock: increment(-quantity)
            });
            
            return true;
        } catch (error) {
            console.error('Error decrementing stock:', error);
            throw error;
        }
    }

    // Get all products from a specific collection
    async getProductsByCollection(collection) {
        try {
            const q = query(
                this.productsCollection,
                where('collection', '==', collection)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching products by collection:', error);
            throw error;
        }
    }

    // Add product
    async addProduct(productData) {
        try {
            const docRef = await addDoc(this.productsCollection, {
                ...productData,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    // Update product
    async updateProduct(id, updates) {
        try {
            const docRef = doc(this.productsCollection, id)
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            });
            return true;
        } catch (err) {
            console.error('Error updating product:', err);
            throw error;
        }
    }

    // Add order
    async addOrder(orderData) {
        try {
            const docRef = await addDoc(this.ordersCollection, {
                ...orderData,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    }
}

export default Firestore;