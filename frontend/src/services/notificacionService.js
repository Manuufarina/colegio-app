import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'notificaciones';

export const getNotificaciones = async (userId) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const markAsRead = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    leida: true,
    readAt: serverTimestamp()
  });
  return id;
};

export const markAllAsRead = async (userId) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    where('leida', '==', false)
  );
  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map(d =>
    updateDoc(doc(db, COLLECTION, d.id), {
      leida: true,
      readAt: serverTimestamp()
    })
  );
  await Promise.all(updates);
};
