import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'mensajes';

export const getMensajes = async (userId) => {
  const q = query(
    collection(db, COLLECTION),
    where('participantes', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getConversacion = async (conversacionId) => {
  const q = query(
    collection(db, COLLECTION, conversacionId, 'messages'),
    orderBy('createdAt')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const sendMensaje = async (conversacionId, data) => {
  const msgRef = await addDoc(
    collection(db, COLLECTION, conversacionId, 'messages'),
    {
      ...data,
      createdAt: serverTimestamp()
    }
  );
  await updateDoc(doc(db, COLLECTION, conversacionId), {
    lastMessage: data.texto,
    updatedAt: serverTimestamp()
  });
  return { id: msgRef.id, ...data };
};

export const createConversacion = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};
