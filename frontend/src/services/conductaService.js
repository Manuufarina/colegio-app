import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'conductas';

export const getConductas = async () => {
  const q = query(collection(db, COLLECTION), orderBy('fecha', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getConductasByAlumno = async (alumnoId, filtros = {}) => {
  let q = query(
    collection(db, COLLECTION),
    where('alumnoId', '==', alumnoId),
    orderBy('fecha', 'desc')
  );
  if (filtros.tipo) {
    q = query(
      collection(db, COLLECTION),
      where('alumnoId', '==', alumnoId),
      where('tipo', '==', filtros.tipo),
      orderBy('fecha', 'desc')
    );
  }
  const snapshot = await getDocs(q);
  const conductas = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  const positivas = conductas.filter(c => c.tipo === 'positiva').length;
  const negativas = conductas.filter(c => c.tipo === 'negativa').length;
  const puntos = conductas.reduce((acc, c) => {
    return c.tipo === 'positiva' ? acc + (c.puntos || 0) : acc - (c.puntos || 0);
  }, 0);

  return {
    conductas,
    estadisticas: { total: conductas.length, positivas, negativas, puntos }
  };
};

export const getConducta = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Conducta no encontrada');
  return { id: docSnap.id, ...docSnap.data() };
};

export const addConducta = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    fecha: data.fecha || new Date().toISOString(),
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

export const updateConducta = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteConducta = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
  return id;
};
