import { db } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const COLLECTION = 'calificaciones';

export const getCalificacionesByAlumno = async (alumnoId) => {
  const q = query(
    collection(db, COLLECTION),
    where('alumnoId', '==', alumnoId),
    orderBy('fecha', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getCalificacionesByMateria = async (materiaId, cursoId) => {
  const q = query(
    collection(db, COLLECTION),
    where('materiaId', '==', materiaId),
    where('cursoId', '==', cursoId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getCalificacionesByCurso = async (cursoId, periodo) => {
  let q = query(
    collection(db, COLLECTION),
    where('cursoId', '==', cursoId)
  );
  if (periodo) {
    q = query(q, where('periodo', '==', periodo));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addCalificacion = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

export const updateCalificacion = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteCalificacion = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
  return id;
};
