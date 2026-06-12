import { db } from './firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, doc, limit } from 'firebase/firestore';

export interface ProgressLog {
  id?: string;
  userId: string;
  weight: number;
  chest?: number;
  waist?: number;
  arms?: number;
  legs?: number;
  date: string;
  createdAt?: any;
}

enum OperationType {
  CREATE = 'create',
  DELETE = 'delete',
  LIST = 'list',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function fetchProgressLogs(userId: string): Promise<ProgressLog[]> {
  const path = `users/${userId}/progressLogs`;
  try {
    const q = query(collection(db, path), orderBy('date', 'desc'), limit(30));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProgressLog));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addProgressLog(userId: string, data: Omit<ProgressLog, 'id'|'userId'|'createdAt'>): Promise<string> {
  const path = `users/${userId}/progressLogs`;
  try {
    const payload = {
      ...data,
      userId,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}
