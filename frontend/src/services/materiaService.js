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

const COLLECTION = 'materias';

export const getMaterias = async () => {
  const q = query(collection(db, COLLECTION), orderBy('nombre'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getMateriasByCurso = async (cursoId) => {
  const q = query(
    collection(db, COLLECTION),
    where('cursoId', '==', cursoId),
    orderBy('nombre')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getMateria = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Materia no encontrada');
  return { id: docSnap.id, ...docSnap.data() };
};

export const addMateria = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

export const updateMateria = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteMateria = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
  return id;
};
