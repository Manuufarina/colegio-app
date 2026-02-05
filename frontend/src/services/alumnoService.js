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

const COLLECTION = 'alumnos';

export const getAlumnos = async () => {
  const q = query(collection(db, COLLECTION), orderBy('apellido'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAlumno = async (id) => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Alumno no encontrado');
  return { id: docSnap.id, ...docSnap.data() };
};

export const getAlumnosByCurso = async (cursoId) => {
  const q = query(
    collection(db, COLLECTION),
    where('cursoId', '==', cursoId),
    orderBy('apellido')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addAlumno = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

export const updateAlumno = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  return { id, ...data };
};

export const deleteAlumno = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
  return id;
};
