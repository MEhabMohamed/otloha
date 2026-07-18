export function generateUID(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString('en-ME');
  return time.slice(0, 5) + ' | ' + d.toLocaleDateString();
}

export async function getInitialData(): Promise<any> {
  const res = await fetch('/api/initial-data');
  if (!res.ok) throw new Error('Failed to load initial data');
  return res.json();
}

export async function getRecitations(): Promise<any> {
  const data = await getInitialData();
  return data.recitations;
}

export async function getUsers(): Promise<any> {
  const data = await getInitialData();
  return data.users;
}

export async function getTeachers(): Promise<any> {
  const data = await getInitialData();
  return data.teachers;
}

export async function getStudents(): Promise<any> {
  const data = await getInitialData();
  return data.students;
}

export async function getAdmins(): Promise<any> {
  const data = await getInitialData();
  return data.admins;
}

export async function getTajweeds(): Promise<any> {
  const data = await getInitialData();
  return data.tajweed;
}

export async function getLevels(): Promise<any> {
  const data = await getInitialData();
  return data.levels;
}

export async function getLessons(): Promise<any> {
  const data = await getInitialData();
  return data.lessons;
}

export async function saveLevels(levelData: { name: string; color: string; value: string }): Promise<any> {
  const id = generateUID().replace(/[0-9]/g, 'k');
  const res = await fetch('/api/tajweed/levels', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...levelData }),
  });
  if (!res.ok) throw new Error('Failed to save level');
  return res.json();
}

export async function saveLessons(lessonData: {
  title: string;
  content: string;
  level: string;
  parentLesson: string;
}): Promise<any> {
  const id = generateUID().replace(/[0-9]/g, 'k');
  const res = await fetch('/api/tajweed/lessons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...lessonData }),
  });
  if (!res.ok) throw new Error('Failed to save lesson');
  return res.json();
}

export async function saveEditLessons(lessonData: {
  id: string;
  title: string;
  content: string;
  level: string;
  parentLesson: string;
}): Promise<any> {
  const { id, ...body } = lessonData;
  const res = await fetch(`/api/tajweed/lessons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to edit lesson');
  await res.json();
  return id;
}

export async function saveEditLevels(levelData: {
  id: string;
  name: string;
  color: string;
  value: string;
}): Promise<any> {
  const { id, ...body } = levelData;
  const res = await fetch(`/api/tajweed/levels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to edit level');
  await res.json();
  return id;
}

export async function deleteLevels({ id }: { id: string }): Promise<any> {
  const res = await fetch(`/api/tajweed/levels/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete level');
  await res.json();
  return id;
}

export async function deleteLessons({ id }: { id: string }): Promise<any> {
  const res = await fetch(`/api/tajweed/lessons/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete lesson');
  await res.json();
  return id;
}

export async function saveRecitations(recitationData: {
  verse: any;
  narration: string;
  playback: string;
  authed: string;
}): Promise<any> {
  const res = await fetch('/api/recitations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recitationData),
  });
  if (!res.ok) throw new Error('Failed to save recitation');
  return res.json();
}

function formatStudent(user: any) {
  return {
    ...user,
    status: 'Pending',
    recitations: [],
    ratedRecitations: [],
    joiningDate: Date.now(),
    verified: false,
    level: 'Beginner',
    active: true,
    raters: [],
    rated: [],
    blockList: [],
  };
}

function formatTeacher(user: any) {
  return {
    ...user,
    status: 'Pending',
    recitations: [],
    evaluatedRecitations: [],
    ratedRecitations: [],
    joiningDate: Date.now(),
    verified: false,
    level: 'Beginner',
    active: true,
    rated: [],
    raters: [],
    earnings: [0],
    dues: [0],
    blockList: [],
  };
}

function formatAdmin({ email }: { email: string }) {
  return {
    id: email.split('@')[0].replace(/\s+/g, '').trim().toLowerCase(),
    email,
  };
}

export async function saveStudent(user: any): Promise<any> {
  const formattedUser = formatStudent(user);
  const res = await fetch('/api/users/student', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedUser),
  });
  if (!res.ok) throw new Error('Failed to save student');
  return res.json();
}

export async function saveTeacher(user: any): Promise<any> {
  const formattedUser = formatTeacher(user);
  const res = await fetch('/api/users/teacher', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedUser),
  });
  if (!res.ok) throw new Error('Failed to save teacher');
  return res.json();
}

export async function saveAdmins({ email }: { email: string }): Promise<any> {
  const formattedAdmin = formatAdmin({ email });
  const res = await fetch('/api/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedAdmin),
  });
  if (!res.ok) throw new Error('Failed to save admin');
  return res.json();
}

export async function deleteAdmins({ id }: { id: string }): Promise<any> {
  const res = await fetch(`/api/admins/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete admin');
  await res.json();
  return id;
}

export async function savePasses(passData: { id: string; password: any }): Promise<any> {
  const res = await fetch(`/api/users/${passData.id}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: passData.password }),
  });
  if (!res.ok) throw new Error('Failed to update password');
  await res.json();
  return passData.password;
}

export async function saveUserRatings(ratingData: {
  raterId: string;
  ratedId: string;
  rating: number;
}): Promise<any> {
  const res = await fetch('/api/ratings/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ratingData),
  });
  if (!res.ok) throw new Error('Failed to save user ratings');
  return res.json();
}

export async function saveRecitationRatings(ratingData: {
  raterId: string;
  ratedId: string;
  rating: number;
}): Promise<any> {
  const res = await fetch('/api/ratings/recitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ratingData),
  });
  if (!res.ok) throw new Error('Failed to save recitation ratings');
  return res.json();
}

export async function savePics(picData: { id: string; pic: string }): Promise<any> {
  const res = await fetch(`/api/users/${picData.id}/avatar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pic: picData.pic }),
  });
  if (!res.ok) throw new Error('Failed to update avatar');
  return picData.pic;
}

export async function saveBlocks(blockData: { id: string; authed: string }): Promise<any> {
  const res = await fetch('/api/blocks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blockData),
  });
  if (!res.ok) throw new Error('Failed to block user');
  await res.json();
  return blockData.id;
}

export async function saveUnblocks(blockData: { id: string; authed: string }): Promise<any> {
  const res = await fetch('/api/unblocks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blockData),
  });
  if (!res.ok) throw new Error('Failed to unblock user');
  await res.json();
  return blockData.id;
}

export async function saveEvaluations(evaluationData: {
  id: string;
  authed: string;
  status: string;
  name: string;
  avatar: string;
  report: string;
}): Promise<any> {
  const res = await fetch('/api/evaluations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evaluationData),
  });
  if (!res.ok) throw new Error('Failed to save evaluation');
  await res.json();
  return evaluationData.id;
}

export async function saveTeacherEvaluation({ id, status }: { id: string; status: string }): Promise<any> {
  const res = await fetch(`/api/users/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to evaluate teacher');
  await res.json();
  return { id, status };
}

export async function getSessionUser(): Promise<any> {
  const res = await fetch('/api/session');
  if (!res.ok) return null;
  const data = await res.json();
  return data.id;
}

export async function setSessionUser(id: string | null): Promise<any> {
  if (id) {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  } else {
    const res = await fetch('/api/session', {
      method: 'DELETE',
    });
    return res.json();
  }
}

export async function deleteUser(id: string): Promise<any> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  await res.json();
  return id;
}

export async function deleteRecitation(id: string): Promise<any> {
  const res = await fetch(`/api/recitations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete recitation');
  await res.json();
  return id;
}
