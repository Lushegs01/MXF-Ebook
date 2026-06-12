import { db } from './firebase';
import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  serverTimestamp,
  doc,
  limit,
} from 'firebase/firestore';

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

export interface WorkoutSessionLog {
  id?: string;
  userId: string;
  workoutId: string;
  workoutTitle: string;
  durationMin: number;
  exerciseCount: number;
  completedAt: string; // YYYY-MM-DD
  createdAt?: any;
}

export interface UserProfile {
  isPremium: boolean;
  goalWeight: number | null;
  notificationsEnabled: boolean;
}

export const DEFAULT_PROFILE: UserProfile = {
  isPremium: false,
  goalWeight: null,
  notificationsEnabled: true,
};

enum OperationType {
  CREATE = 'create',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  UPDATE = 'update',
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

// --- Progress logs -------------------------------------------------------

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

// --- Workout session history ---------------------------------------------

export async function fetchWorkoutSessions(userId: string): Promise<WorkoutSessionLog[]> {
  const path = `users/${userId}/workoutSessions`;
  try {
    const q = query(collection(db, path), orderBy('completedAt', 'desc'), limit(60));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutSessionLog));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addWorkoutSession(
  userId: string,
  data: Omit<WorkoutSessionLog, 'id' | 'userId' | 'createdAt'>,
): Promise<string> {
  const path = `users/${userId}/workoutSessions`;
  try {
    const payload = { ...data, userId, createdAt: serverTimestamp() };
    const docRef = await addDoc(collection(db, path), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

// --- User profile (premium status + preferences) -------------------------

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const path = `users/${userId}`;
  try {
    const snapshot = await getDoc(doc(db, path));
    if (!snapshot.exists()) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...(snapshot.data() as Partial<UserProfile>) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return { ...DEFAULT_PROFILE };
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, path), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
