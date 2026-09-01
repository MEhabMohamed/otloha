const DEFAULT_ADMINS = {
  mohamedelenna90: {
    email: 'mohamedelenna90@gmail.com',
    id: 'mohamedelenna90',
  },
};

function getSessionData(key: string, fallback: any): any {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return fallback;
  }
  try {
    const item = window.sessionStorage.getItem(key);
    if (item !== null && item !== undefined && item !== '') {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error(`Error reading ${key} from sessionStorage:`, e);
  }
  setSessionData(key, fallback);
  return fallback;
}

function setSessionData(key: string, data: any): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return;
  }
  try {
    window.sessionStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to sessionStorage:`, e);
  }
}

// Memory caches initialized from sessionStorage
let recitations = getSessionData('recitations', {});
let teachers = getSessionData('teachers', {});
let students = getSessionData('students', {});
let users = getSessionData('users', { ...teachers, ...students });
let levels = getSessionData('levels', {});
let lessons = getSessionData('lessons', {});
let tajweed = getSessionData('tajweed', { levels: { ...levels }, lessons: { ...lessons } });
let admins = getSessionData('admins', DEFAULT_ADMINS);
let authedUserSession = getSessionData('authedUser', null);

export function generateUID(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const time = d.toLocaleTimeString('en-ME');
  return time.slice(0, 5) + ' | ' + d.toLocaleDateString();
}

export function getRecitations(): Promise<any> {
  return new Promise((res) => {
    recitations = getSessionData('recitations', recitations);
    setTimeout(() => res({ ...recitations }), 50);
  });
}

export function getUsers(): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    setTimeout(() => res({ ...users }), 50);
  });
}

export function getTeachers(): Promise<any> {
  return new Promise((res) => {
    teachers = getSessionData('teachers', teachers);
    setTimeout(() => res({ ...teachers }), 50);
  });
}

export function getStudents(): Promise<any> {
  return new Promise((res) => {
    students = getSessionData('students', students);
    setTimeout(() => res({ ...students }), 50);
  });
}

export function getAdmins(): Promise<any> {
  return new Promise((res) => {
    admins = getSessionData('admins', admins);
    setTimeout(() => res({ ...admins }), 50);
  });
}

export function getTajweeds(): Promise<any> {
  return new Promise((res) => {
    tajweed = getSessionData('tajweed', tajweed);
    setTimeout(() => res({ ...tajweed }), 50);
  });
}

export function getLevels(): Promise<any> {
  return new Promise((res) => {
    levels = getSessionData('levels', levels);
    setTimeout(() => res({ ...levels }), 50);
  });
}

export function getLessons(): Promise<any> {
  return new Promise((res) => {
    lessons = getSessionData('lessons', lessons);
    setTimeout(() => res({ ...lessons }), 50);
  });
}

export async function getInitialData(): Promise<any> {
  const [rec, u, adm, stud, teach, taj, lev, les] = await Promise.all([
    getRecitations(),
    getUsers(),
    getAdmins(),
    getStudents(),
    getTeachers(),
    getTajweeds(),
    getLevels(),
    getLessons(),
  ]);
  return {
    recitations: rec,
    users: u,
    admins: adm,
    students: stud,
    teachers: teach,
    tajweed: taj,
    levels: lev,
    lessons: les,
  };
}

export function getSessionUser(): Promise<any> {
  return new Promise((res) => {
    authedUserSession = getSessionData('authedUser', authedUserSession);
    res(authedUserSession);
  });
}

export function setSessionUser(id: string | null): Promise<any> {
  return new Promise((res) => {
    authedUserSession = id;
    setSessionData('authedUser', id);
    res(id);
  });
}

function formatStudentRecitation({ verse, narration, playback, authed }: any) {
  return {
    verse,
    narration,
    playback,
    authed,
    id: generateUID().replace(/[0-9]/g, 'k'),
    status: 'Pending',
    raters: [],
    createdAt: Date.now(),
    evaluatedAt: '',
    teacher: {
      name: '',
      avatar: '',
    },
    remarkable: false,
    report: '',
    reviewed: false,
    closed: false,
  };
}

function formatTeacherRecitation({ verse, narration, playback, authed }: any) {
  return {
    verse,
    narration,
    playback,
    authed,
    id: generateUID().replace(/[0-9]/g, 'k'),
    status: 'Accepted',
    raters: [],
    createdAt: Date.now(),
    remarkable: false,
    closed: false,
  };
}

function formatTeacher({ id, name, password, country, description, email, gender, avatar, due, lang, bDate }: any) {
  return {
    id,
    name,
    email,
    gender,
    avatar,
    country,
    password,
    description: description || 'teacher',
    due,
    lang,
    bDate,
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

function formatStudent({ id, name, password, country, description, narration, email, gender, avatar, lang, bDate }: any) {
  return {
    id,
    name,
    email,
    gender,
    avatar,
    country,
    password,
    description: description || 'student',
    narration,
    lang,
    bDate,
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

function formatAdmin({ email }: { email: string }) {
  return {
    id: email.split('@')[0].replace(/\s+/g, '').trim().toLowerCase(),
    email,
  };
}

function formatLevel({ name, color, value }: any) {
  return {
    name,
    color,
    value,
    id: generateUID().replace(/[0-9]/g, 'k'),
  };
}

function formatLesson({ title, content, level, parentLesson }: any) {
  return {
    title,
    content,
    level,
    parentLesson,
    id: generateUID().replace(/[0-9]/g, 'k'),
  };
}

export function saveLevels({ name, color, value }: { name: string; color: string; value: string }): Promise<any> {
  return new Promise((res) => {
    const formattedLevel = formatLevel({ name, color, value });
    levels = getSessionData('levels', levels);
    lessons = getSessionData('lessons', lessons);
    levels = { ...levels, [formattedLevel.id]: formattedLevel };
    tajweed = { lessons: { ...lessons }, levels: { ...levels } };
    setSessionData('levels', levels);
    setSessionData('tajweed', tajweed);
    setTimeout(() => res(formattedLevel), 50);
  });
}

export function saveLessons({ title, content, level, parentLesson }: { title: string; content: string; level: string; parentLesson: string }): Promise<any> {
  return new Promise((res) => {
    const formattedLesson = formatLesson({ title, content, level, parentLesson });
    levels = getSessionData('levels', levels);
    lessons = getSessionData('lessons', lessons);
    lessons = { ...lessons, [formattedLesson.id]: formattedLesson };
    tajweed = { lessons: { ...lessons }, levels: { ...levels } };
    setSessionData('lessons', lessons);
    setSessionData('tajweed', tajweed);
    setTimeout(() => res(formattedLesson), 50);
  });
}

export function saveEditLessons({ id, title, content, level, parentLesson }: any): Promise<any> {
  return new Promise((res) => {
    levels = getSessionData('levels', levels);
    lessons = getSessionData('lessons', lessons);
    lessons = {
      ...lessons,
      [id]: {
        ...lessons[id],
        title,
        content,
        level,
        parentLesson,
      },
    };
    tajweed = { lessons: { ...lessons }, levels: { ...levels } };
    setSessionData('lessons', lessons);
    setSessionData('tajweed', tajweed);
    setTimeout(() => res(id), 50);
  });
}

export function saveEditLevels({ id, name, color, value }: any): Promise<any> {
  return new Promise((res) => {
    levels = getSessionData('levels', levels);
    lessons = getSessionData('lessons', lessons);
    levels = {
      ...levels,
      [id]: {
        ...levels[id],
        name,
        color,
        value,
      },
    };
    tajweed = { lessons: { ...lessons }, levels: { ...levels } };
    setSessionData('levels', levels);
    setSessionData('tajweed', tajweed);
    setTimeout(() => res(id), 50);
  });
}

export function deleteLevels({ id }: { id: string }): Promise<any> {
  return new Promise((res) => {
    levels = getSessionData('levels', levels);
    lessons = getSessionData('lessons', lessons);
    levels = Object.fromEntries(Object.entries(levels).filter((e) => e[0] !== id));
    tajweed = { lessons: { ...lessons }, levels: { ...levels } };
    setSessionData('levels', levels);
    setSessionData('tajweed', tajweed);
    setTimeout(() => res(id), 50);
  });
}

export function deleteLessons({ id }: { id: string }): Promise<any> {
  return new Promise((res) => {
    levels = getSessionData('levels', levels);
    lessons = getSessionData('lessons', lessons);
    lessons = Object.fromEntries(Object.entries(lessons).filter((e) => e[0] !== id));
    tajweed = { lessons: { ...lessons }, levels: { ...levels } };
    setSessionData('lessons', lessons);
    setSessionData('tajweed', tajweed);
    setTimeout(() => res(id), 50);
  });
}

export function saveRecitations({ verse, narration, playback, authed }: any): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);
    recitations = getSessionData('recitations', recitations);

    let formattedRecitation: any;
    if (users[authed] && users[authed].description === 'teacher') {
      formattedRecitation = formatTeacherRecitation({ verse, narration, playback, authed });
      teachers = {
        ...teachers,
        [authed]: {
          ...teachers[authed],
          recitations: (teachers[authed]?.recitations || []).concat([formattedRecitation.id]),
        },
      };
    } else {
      formattedRecitation = formatStudentRecitation({ verse, narration, playback, authed });
      if (students[authed]) {
        students = {
          ...students,
          [authed]: {
            ...students[authed],
            recitations: (students[authed]?.recitations || []).concat([formattedRecitation.id]),
          },
        };
      }
    }

    recitations = {
      ...recitations,
      [formattedRecitation.id]: formattedRecitation,
    };

    users = { ...teachers, ...students };
    setSessionData('recitations', recitations);
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);

    setTimeout(() => res(formattedRecitation), 50);
  });
}

export function saveStudent(user: any): Promise<any> {
  return new Promise((res) => {
    const formattedUser = formatStudent(user);
    students = getSessionData('students', students);
    teachers = getSessionData('teachers', teachers);

    students = {
      ...students,
      [formattedUser.id]: formattedUser,
    };
    users = { ...students, ...teachers };

    setSessionData('students', students);
    setSessionData('users', users);

    setTimeout(() => res(formattedUser), 50);
  });
}

export function saveTeacher(user: any): Promise<any> {
  return new Promise((res) => {
    const formattedUser = formatTeacher(user);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    teachers = {
      ...teachers,
      [formattedUser.id]: formattedUser,
    };
    users = { ...students, ...teachers };

    setSessionData('teachers', teachers);
    setSessionData('users', users);

    setTimeout(() => res(formattedUser), 50);
  });
}

export function saveAdmins({ email }: { email: string }): Promise<any> {
  return new Promise((res) => {
    const formattedAdmin = formatAdmin({ email });
    admins = getSessionData('admins', admins);
    admins = { ...admins, [formattedAdmin.id]: formattedAdmin };
    setSessionData('admins', admins);
    setTimeout(() => res(formattedAdmin), 50);
  });
}

export function deleteAdmins({ id }: { id: string }): Promise<any> {
  return new Promise((res) => {
    admins = getSessionData('admins', admins);
    admins = Object.fromEntries(Object.entries(admins).filter((e) => e[0] !== id));
    setSessionData('admins', admins);
    setTimeout(() => res(id), 50);
  });
}

export function savePasses({ id, password }: { id: string; password: any }): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    if (users[id] && users[id].description === 'teacher') {
      teachers = {
        ...teachers,
        [id]: { ...teachers[id], password },
      };
    } else if (students[id]) {
      students = {
        ...students,
        [id]: { ...students[id], password },
      };
    }
    users = { ...teachers, ...students };
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);
    setTimeout(() => res(password), 50);
  });
}

export function saveUserRatings({ raterId, ratedId, rating }: { raterId: string; ratedId: string; rating: number }): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    if (users[ratedId]) {
      if (users[ratedId].description === 'teacher') {
        teachers = {
          ...teachers,
          [ratedId]: {
            ...teachers[ratedId],
            raters: (teachers[ratedId]?.raters || []).concat([{ raterId, rating }]),
          },
        };
      } else {
        students = {
          ...students,
          [ratedId]: {
            ...students[ratedId],
            raters: (students[ratedId]?.raters || []).concat([{ raterId, rating }]),
          },
        };
      }
    }

    if (users[raterId]) {
      if (users[raterId].description === 'teacher') {
        teachers = {
          ...teachers,
          [raterId]: {
            ...teachers[raterId],
            rated: (teachers[raterId]?.rated || []).concat([{ ratedId, rating }]),
          },
        };
      } else {
        students = {
          ...students,
          [raterId]: {
            ...students[raterId],
            rated: (students[raterId]?.rated || []).concat([{ ratedId, rating }]),
          },
        };
      }
    }

    users = { ...teachers, ...students };
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);
    setTimeout(() => res({ raterId, ratedId, rating }), 50);
  });
}

export function saveRecitationRatings({ raterId, ratedId, rating }: { raterId: string; ratedId: string; rating: number }): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);
    recitations = getSessionData('recitations', recitations);

    if (recitations[ratedId]) {
      recitations = {
        ...recitations,
        [ratedId]: {
          ...recitations[ratedId],
          raters: (recitations[ratedId]?.raters || []).concat([{ raterId, rating }]),
        },
      };
    }

    if (users[raterId] && users[raterId].description === 'teacher') {
      teachers = {
        ...teachers,
        [raterId]: {
          ...teachers[raterId],
          ratedRecitations: (teachers[raterId]?.ratedRecitations || []).concat([ratedId]),
        },
      };
    } else if (students[raterId]) {
      students = {
        ...students,
        [raterId]: {
          ...students[raterId],
          ratedRecitations: (students[raterId]?.ratedRecitations || []).concat([ratedId]),
        },
      };
    }

    users = { ...teachers, ...students };
    setSessionData('recitations', recitations);
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);
    setTimeout(() => res({ raterId, ratedId, rating }), 50);
  });
}

export function savePics({ id, pic }: { id: string; pic: string }): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    if (users[id] && users[id].description === 'teacher') {
      teachers = {
        ...teachers,
        [id]: { ...teachers[id], avatar: pic },
      };
    } else if (students[id]) {
      students = {
        ...students,
        [id]: { ...students[id], avatar: pic },
      };
    }
    users = { ...teachers, ...students };
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);
    setTimeout(() => res(pic), 50);
  });
}

export function saveProfileDetails(profileData: { id: string; name?: string; lang?: string; narration?: string; due?: string }): Promise<any> {
  return new Promise((res) => {
    const { id, ...body } = profileData;
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    if (users[id] && users[id].description === 'teacher') {
      teachers = {
        ...teachers,
        [id]: { ...teachers[id], ...body },
      };
    } else if (students[id]) {
      students = {
        ...students,
        [id]: { ...students[id], ...body },
      };
    }
    users = { ...teachers, ...students };
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);
    setTimeout(() => res(users[id]), 50);
  });
}

export function saveBlocks({ id, authed }: { id: string; authed: string }): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    if (users[authed] && users[authed].description === 'teacher') {
      teachers = {
        ...teachers,
        [authed]: {
          ...teachers[authed],
          blockList: (teachers[authed]?.blockList || []).concat([id]),
        },
      };
      if (students[id]) {
        students = {
          ...students,
          [id]: { ...students[id], active: false },
        };
      }
    } else if (students[authed]) {
      students = {
        ...students,
        [authed]: {
          ...students[authed],
          blockList: (students[authed]?.blockList || []).concat([id]),
        },
      };
    }
    users = { ...teachers, ...students };
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);
    setTimeout(() => res(id), 50);
  });
}

export function saveUnblocks({ id, authed }: { id: string; authed: string }): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    if (users[authed] && users[authed].description === 'teacher') {
      teachers = {
        ...teachers,
        [authed]: {
          ...teachers[authed],
          blockList: (teachers[authed]?.blockList || []).filter((i: string) => i !== id),
        },
      };
      if (students[id]) {
        students = {
          ...students,
          [id]: { ...students[id], active: true },
        };
      }
    } else if (students[authed]) {
      students = {
        ...students,
        [authed]: {
          ...students[authed],
          blockList: (students[authed]?.blockList || []).filter((i: string) => i !== id),
        },
      };
    }
    users = { ...teachers, ...students };
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setSessionData('users', users);
    setTimeout(() => res(id), 50);
  });
}

export function saveEvaluations({ id, authed, status, name, avatar, report }: any): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);
    recitations = getSessionData('recitations', recitations);

    if (recitations[id]) {
      recitations = {
        ...recitations,
        [id]: {
          ...recitations[id],
          evaluatedAt: Date.now(),
          status,
          teacher: { name, avatar },
          report,
        },
      };
    }

    if (teachers[authed]) {
      teachers = {
        ...teachers,
        [authed]: {
          ...teachers[authed],
          evaluatedRecitations: (teachers[authed]?.evaluatedRecitations || []).concat([id]),
        },
      };
    }

    users = { ...teachers, ...students };
    setSessionData('recitations', recitations);
    setSessionData('teachers', teachers);
    setSessionData('users', users);
    setTimeout(() => res(id), 50);
  });
}

export function saveTeacherEvaluation({ id, status }: { id: string; status: string }): Promise<any> {
  return new Promise((res) => {
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    if (teachers[id]) {
      teachers = {
        ...teachers,
        [id]: { ...teachers[id], status },
      };
    }
    users = { ...teachers, ...students };
    setSessionData('teachers', teachers);
    setSessionData('users', users);
    setTimeout(() => res({ id, status }), 50);
  });
}

export function deleteUser(id: string): Promise<any> {
  return new Promise((res) => {
    users = getSessionData('users', users);
    teachers = getSessionData('teachers', teachers);
    students = getSessionData('students', students);

    users = Object.fromEntries(Object.entries(users).filter((e) => e[0] !== id));
    teachers = Object.fromEntries(Object.entries(teachers).filter((e) => e[0] !== id));
    students = Object.fromEntries(Object.entries(students).filter((e) => e[0] !== id));

    setSessionData('users', users);
    setSessionData('teachers', teachers);
    setSessionData('students', students);
    setTimeout(() => res(id), 50);
  });
}

export function deleteRecitation(id: string): Promise<any> {
  return new Promise((res) => {
    recitations = getSessionData('recitations', recitations);
    recitations = Object.fromEntries(Object.entries(recitations).filter((e) => e[0] !== id));
    setSessionData('recitations', recitations);
    setTimeout(() => res(id), 50);
  });
}
