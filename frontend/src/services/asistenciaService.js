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

const COLLECTION = 'asistencias';

export const getAsistenciasByCurso = async (cursoId, fecha) => {
  let q = query(
    collection(db, COLLECTION),
    where('cursoId', '==', cursoId)
  );
  if (fecha) {
    q = query(q, where('fecha', '==', fecha));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAsistenciasByAlumno = async (alumnoId) => {
  const q = query(
    collection(db, COLLECTION),
    where('alumnoId', '==', alumnoId),
    orderBy('fecha', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addAsistencia = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...data };
};

export const addAsistenciaMasiva = async (registros) => {
  const results = [];
  for (const registro of registros) {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...registro,
      createdAt: serverTimestamp()
    });
    results.push({ id: docRef.id, ...registro });
  }
  return results;
};

export const updateAsistencia = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
  return { id, ...data };
};
