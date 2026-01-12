import { 
  collection, 
  addDoc, 
  Timestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebaseConfig'; // Import your db configuration

// Consultation request save করা
export const saveConsultationRequest = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'consultations'), {
      ...data,
      createdAt: Timestamp.now(),
      status: 'pending',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

// Admin-এর জন্য সব requests fetch করা
export const getConsultationRequests = async () => {
  try {
    const q = query(collection(db, 'consultations'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};