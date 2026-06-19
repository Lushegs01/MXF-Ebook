import { db } from './firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, doc, limit, where, setDoc } from 'firebase/firestore';

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

export interface WorkoutCategory {
  id?: string;
  title: string;
  count: number;
  image: string;
}

export interface Exercise {
  id?: string;
  categoryId: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  target: string;
  image: string;
}

export interface NutritionPlan {
  id?: string;
  title: string;
  cals: string;
  image: string;
}

export interface WorkoutLog {
  id?: string;
  userId: string;
  categoryId: string;
  date: string;
  durationMinutes: number;
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

export async function fetchWorkoutCategories(): Promise<WorkoutCategory[]> {
  try {
    const snapshot = await getDocs(collection(db, 'workoutCategories'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutCategory));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'workoutCategories');
    return [];
  }
}

export async function fetchExercises(categoryId: string): Promise<Exercise[]> {
  try {
    const q = query(collection(db, 'exercises'), where('categoryId', '==', categoryId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'exercises');
    return [];
  }
}

export async function fetchExerciseById(id: string): Promise<Exercise | null> {
  const { getDoc } = await import('firebase/firestore');
  try {
    const docRef = doc(db, 'exercises', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Exercise;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `exercises/${id}`);
    return null;
  }
}


export async function fetchNutritionPlans(): Promise<NutritionPlan[]> {
  try {
    const snapshot = await getDocs(collection(db, 'nutritionPlans'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NutritionPlan));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'nutritionPlans');
    return [];
  }
}

export async function fetchWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
  const path = `users/${userId}/workoutLogs`;
  try {
    const q = query(collection(db, path), orderBy('date', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addWorkoutLog(userId: string, data: Omit<WorkoutLog, 'id'|'userId'|'createdAt'>): Promise<string> {
  const path = `users/${userId}/workoutLogs`;
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

export async function seedDatabaseIfEmpty() {
  try {
    const cats = await getDocs(query(collection(db, 'workoutCategories'), limit(1)));
    if (cats.empty) {
      console.log('Seeding database...');
      
      const MOCK_CATEGORIES = [
        { id: 'fat-loss', title: 'Fat Loss', count: 24, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
        { id: 'muscle-gain', title: 'Muscle Gain', count: 18, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop' },
        { id: 'strength', title: 'Strength', count: 15, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop' },
        { id: 'cardio', title: 'Cardio', count: 30, image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=600&auto=format&fit=crop' }
      ];
      for (const cat of MOCK_CATEGORIES) {
        await setDoc(doc(db, 'workoutCategories', cat.id), {
          title: cat.title, count: cat.count, image: cat.image
        });
      }

      const MOCK_EXERCISES = [
        { id: 'bench-press', categoryId: 'muscle-gain', name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: 60, target: 'Chest, Triceps', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' },
        { id: 'incline-press', categoryId: 'muscle-gain', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: 60, target: 'Upper Chest', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' },
        { id: 'squat', categoryId: 'muscle-gain', name: 'Barbell Squat', sets: 4, reps: '8-10', rest: 90, target: 'Quads, Glutes', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop' }
      ];
      for (const ex of MOCK_EXERCISES) {
        await setDoc(doc(db, 'exercises', ex.id), {
          categoryId: ex.categoryId, name: ex.name, sets: ex.sets, reps: ex.reps, rest: ex.rest, target: ex.target, image: ex.image
        });
      }

      const MOCK_NUTRITION = [
        { id: 'high-protein', title: 'High Protein Meals', cals: '2400', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop' },
        { id: 'fat-loss-plan', title: 'Fat Loss Guide', cals: '1800', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop' }
      ];
      for (const nut of MOCK_NUTRITION) {
        await setDoc(doc(db, 'nutritionPlans', nut.id), {
          title: nut.title, cals: nut.cals, image: nut.image
        });
      }
      
      console.log('Seed complete.');
    }
  } catch(e) {
    console.error('Seed check failed:', e);
  }
}

