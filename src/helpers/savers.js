const DEFAULT_ADMINS = {
    mohamedelenna90: {
        email: 'mohamedelenna90@gmail.com',
        id: 'mohamedelenna90'
    }
};

function getSessionData(key, fallback) {
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

function setSessionData(key, data) {
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

export function getRecitations() {
    return new Promise((res) => {
        recitations = getSessionData('recitations', recitations);
        setTimeout(() => res({ ...recitations }), 200);
    });
}

export function getUsers() {
    return new Promise((res) => {
        users = getSessionData('users', users);
        setTimeout(() => res({ ...users }), 200);
    });
}

export function getTeachers() {
    return new Promise((res) => {
        teachers = getSessionData('teachers', teachers);
        setTimeout(() => res({ ...teachers }), 200);
    });
}

export function getStudents() {
    return new Promise((res) => {
        students = getSessionData('students', students);
        setTimeout(() => res({ ...students }), 200);
    });
}

export function getAdmins() {
    return new Promise((res) => {
        admins = getSessionData('admins', admins);
        setTimeout(() => res({ ...admins }), 200);
    });
}

export function getTajweeds() {
    return new Promise((res) => {
        tajweed = getSessionData('tajweed', tajweed);
        setTimeout(() => res({ ...tajweed }), 200);
    });
}

export function getLevels() {
    return new Promise((res) => {
        levels = getSessionData('levels', levels);
        setTimeout(() => res({ ...levels }), 200);
    });
}

export function getLessons() {
    return new Promise((res) => {
        lessons = getSessionData('lessons', lessons);
        setTimeout(() => res({ ...lessons }), 200);
    });
}

export const getInitialData = async () => {
    return Promise.all([
        getRecitations(),
        getUsers(),
        getAdmins(),
        getStudents(),
        getTeachers(),
        getTajweeds(),
        getLevels(),
        getLessons(),
    ]).then(([recitations, users, admins, students, teachers, tajweed, levels, lessons]) => ({
        recitations,
        users,
        admins,
        students,
        teachers,
        tajweed,
        levels,
        lessons
    }));
};

function generateUID () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate (timestamp) {
    const d = new Date(timestamp);
    const time = d.toLocaleTimeString('en-ME');
    return time.replace(0, 5) + ' | ' + d.toLocaleDateString();
}

function formatStudentRecitation ({
        verse,
        narration,
        playback,
        authed
    }) {
    return {
        verse,
        narration,
        playback,
        authed,
        id: generateUID().replace(/[0-9]/g, 'k'),
        status: "Pending",
        raters: [],
        createdAt: Date.now(),
        evaluatedAt: "",
        teacher: {
            name: "",
            avatar: ""
        },
        remarkable: false,
        report: "",
        reviewed: false,
        closed: false
    };
}

function formatTeacherRecitation ({
    verse,
    narration,
    playback,
    authed
}) {
    return {
        verse,
        narration,
        playback,
        authed,
        id: generateUID().replace(/[0-9]/g, 'k'),
        status: "Accepted",
        raters: [],
        createdAt: Date.now(),
        remarkable: false,
        closed: false
    };
}

function formatTeacher ({
        id,
        name,
        password,
        country,
        description,
        email,
        gender,
        avatar,
        due,
        lang,
        bDate
    }) {
    return {
        id,
        name,
        email,
        gender,
        avatar,
        country,
        password,
        description,
        due,
        lang,
        bDate,
        status: "Pending",
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
        blockList: []
    };
}

function formatStudent ({
        id,
        name,
        password,
        country,
        description,
        narration,
        email,
        gender,
        avatar,
        lang,
        bDate
    }) {
    return {
        id,
        name,
        email,
        gender,
        avatar,
        country,
        password,
        description,
        narration,
        lang,
        bDate,
        status: "Pending",
        recitations: [],
        ratedRecitations: [],
        joiningDate: Date.now(),
        verified: false,
        level: 'Beginner',
        active: true,
        raters: [],
        rated: [],
        blockList: []
    };
}

function formatAdmin({email}) {
    return {
        id: email.split('@')[0].replace(/\s+/g, '').trim().toLowerCase(),
        email,
    };
}

function formatLevel({
    name,
    color,
    value
}) {
    return {
        name,
        color,
        value,
        id: generateUID().replace(/[0-9]/g, 'k'),
    };
}

function formatLesson({
    title,
    content,
    level,
    parentLesson
}) {
    return {
        title,
        content,
        level,
        parentLesson,
        id: generateUID().replace(/[0-9]/g, 'k'),
    };
}

export function saveLevels({
    name,
    color,
    value
}) {
    return new Promise((res) => {
        const formattedLevel = formatLevel({
            name,
            color,
            value
        });

        levels = getSessionData('levels', levels);
        lessons = getSessionData('lessons', lessons);

        levels = {
            ...levels,
            [formattedLevel.id]: formattedLevel
        };

        tajweed = {
            lessons: { ...lessons },
            levels: { ...levels }
        };

        setSessionData('levels', levels);
        setSessionData('tajweed', tajweed);

        setTimeout(() => {
            res(formattedLevel);
        }, 200);
    });
}

export function saveLessons({
    title,
    content,
    level,
    parentLesson
}) {
    return new Promise((res) => {
        const formattedLesson = formatLesson({
            title,
            content,
            level,
            parentLesson
        });

        levels = getSessionData('levels', levels);
        lessons = getSessionData('lessons', lessons);

        lessons = {
            ...lessons,
            [formattedLesson.id]: formattedLesson
        };

        tajweed = {
            lessons: { ...lessons },
            levels: { ...levels }
        };

        setSessionData('lessons', lessons);
        setSessionData('tajweed', tajweed);

        setTimeout(() => {
            res(formattedLesson);
        }, 200);
    });
}

export function saveEditLessons ({id, title, content, level, parentLesson}) {
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
                parentLesson
            }
        };

        tajweed = {
            lessons: { ...lessons },
            levels: { ...levels }
        };

        setSessionData('lessons', lessons);
        setSessionData('tajweed', tajweed);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function saveEditLevels ({id, name, color, value}) {
    return new Promise((res) => {
        levels = getSessionData('levels', levels);
        lessons = getSessionData('lessons', lessons);

        levels = {
            ...levels,
            [id]: {
                ...levels[id],
                name,
                color,
                value
            }
        };

        tajweed = {
            lessons: { ...lessons },
            levels: { ...levels }
        };

        setSessionData('levels', levels);
        setSessionData('tajweed', tajweed);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function deleteLevels ({id}) {
    return new Promise((res) => {
        levels = getSessionData('levels', levels);
        lessons = getSessionData('lessons', lessons);

        levels = Object.fromEntries(Object.entries(levels).filter(e => e[0] !== id));

        tajweed = {
            lessons: { ...lessons },
            levels: { ...levels }
        };

        setSessionData('levels', levels);
        setSessionData('tajweed', tajweed);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function deleteLessons ({id}) {
    return new Promise((res) => {
        levels = getSessionData('levels', levels);
        lessons = getSessionData('lessons', lessons);

        lessons = Object.fromEntries(Object.entries(lessons).filter(e => e[0] !== id));

        tajweed = {
            lessons: { ...lessons },
            levels: { ...levels }
        };

        setSessionData('lessons', lessons);
        setSessionData('tajweed', tajweed);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function saveRecitations({
        verse,
        narration,
        playback,
        authed
    }) {
    return new Promise((res) => {
        users = getSessionData('users', users);
        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);
        recitations = getSessionData('recitations', recitations);

        let formattedRecitation;

        if (users[authed] && users[authed].description === "teacher") {
            formattedRecitation = formatTeacherRecitation({
                verse,
                narration,
                playback,
                authed,
            });
        } else {
            formattedRecitation = formatStudentRecitation({
                verse,
                narration,
                playback,
                authed,
            });
        }

        recitations = {
            ...recitations,
            [formattedRecitation.id]: formattedRecitation
        };

        if (users[authed] && users[authed].description === "teacher") {
            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    recitations: (teachers[authed]?.recitations || []).concat([formattedRecitation.id])
                }
            };
        } else {
            students = {
                ...students,
                [authed]: {
                    ...students[authed],
                    recitations: (students[authed]?.recitations || []).concat([formattedRecitation.id])
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('recitations', recitations);
        setSessionData('teachers', teachers);
        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(formattedRecitation);
        }, 200);
    });
}

export function saveStudent({
        id,
        name,
        password,
        country,
        narration,
        description,
        email,
        gender,
        avatar,
        lang,
        bDate
    }) {
    return new Promise((res) => {
        const formattedUser = formatStudent({
            id,
            name,
            email,
            gender,
            country,
            avatar,
            password,
            description,
            narration,
            lang,
            bDate
        });

        students = getSessionData('students', students);
        teachers = getSessionData('teachers', teachers);

        students = {
            ...students,
            [formattedUser.id]: formattedUser
        };

        users = {
            ...students,
            ...teachers
        };

        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(formattedUser);
        }, 200);
    });
}

export function saveTeacher({
        id,
        name,
        password,
        country,
        description,
        email,
        gender,
        avatar,
        due,
        lang,
        bDate
    }) {
    return new Promise((res) => {
        const formattedUser = formatTeacher({
            id,
            name,
            email,
            gender,
            country,
            avatar,
            password,
            description,
            due,
            lang,
            bDate
        });

        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);

        teachers = {
            ...teachers,
            [formattedUser.id]: formattedUser
        };

        users = {
            ...students,
            ...teachers
        };

        setSessionData('teachers', teachers);
        setSessionData('users', users);

        setTimeout(() => {
            res(formattedUser);
        }, 200);
    });
}

export function saveAdmins ({email}) {
    return new Promise((res) => {
        const formattedAdmin = formatAdmin({
            email
        });

        admins = getSessionData('admins', admins);
        admins = {
            ...admins,
            [formattedAdmin.id]: formattedAdmin
        };

        setSessionData('admins', admins);

        setTimeout(() => {
            res(formattedAdmin);
        }, 200);
    });
}

export function deleteAdmins ({id}) {
    return new Promise((res) => {
        admins = getSessionData('admins', admins);
        admins = Object.fromEntries(Object.entries(admins).filter(e => e[0] !== id));

        setSessionData('admins', admins);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function savePasses ({
        id,
        password
    }) {
    return new Promise((res) => {
        users = getSessionData('users', users);
        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);

        if (users[id] && users[id].description === "teacher") {
            teachers = {
                ...teachers,
                [id]: {
                    ...teachers[id],
                    password: password
                }
            };
        } else if (students[id]) {
            students = {
                ...students,
                [id]: {
                    ...students[id],
                    password: password
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('teachers', teachers);
        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(password);
        }, 200);
    });
}

export function saveUserRatings ({
    raterId,
    ratedId,
    rating
}) {
    return new Promise((res) => {
        users = getSessionData('users', users);
        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);

        if (users[ratedId] && users[ratedId].description === "teacher") {
            teachers = {
                ...teachers,
                [ratedId]: {
                    ...teachers[ratedId],
                    raters: (teachers[ratedId]?.raters || []).concat([{raterId, rating}]),
                },
            };
        } else if (students[ratedId]) {
            students = {
                ...students,
                [ratedId]: {
                    ...students[ratedId],
                    raters: (students[ratedId]?.raters || []).concat([{raterId, rating}]),
                }
            };
        }

        if (users[raterId] && users[raterId].description === "teacher") {
            teachers = {
                ...teachers,
                [raterId]: {
                    ...teachers[raterId],
                    rated: (teachers[raterId]?.rated || []).concat([ratedId])
                },
            };
        } else if (students[raterId]) {
            students = {
                ...students,
                [raterId]: {
                    ...students[raterId],
                    rated: (students[raterId]?.rated || []).concat([ratedId])
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('teachers', teachers);
        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(raterId, ratedId, rating);
        }, 200);
    });
}

export function saveRecitationRatings ({
    raterId,
    ratedId,
    rating
}) {
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
                    raters: (recitations[ratedId]?.raters || []).concat([{raterId, rating}]),
                }
            };
        }

        if (users[raterId] && users[raterId].description === "teacher") {
            teachers = {
                ...teachers,
                [raterId]: {
                    ...teachers[raterId],
                    ratedRecitations: (teachers[raterId]?.ratedRecitations || []).concat([ratedId])
                }
            };
        } else if (students[raterId]) {
            students = {
                ...students,
                [raterId]: {
                    ...students[raterId],
                    ratedRecitations: (students[raterId]?.ratedRecitations || []).concat([ratedId])
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('recitations', recitations);
        setSessionData('teachers', teachers);
        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(raterId, ratedId, rating);
        }, 200);
    });
}

export function savePics({
        id,
        pic
    }) {
    return new Promise((res) => {
        users = getSessionData('users', users);
        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);

        if (users[id] && users[id].description === "teacher") {
            teachers = {
                ...teachers,
                [id]: {
                    ...teachers[id],
                    avatar: pic
                }
            };
        } else if (students[id]) {
            students = {
                ...students,
                [id]: {
                    ...students[id],
                    avatar: pic
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('teachers', teachers);
        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(pic);
        }, 200);
    });
}

export function saveBlocks({
        id,
        authed
    }) {
    return new Promise((res) => {
        users = getSessionData('users', users);
        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);

        if (users[authed] && users[authed].description === "teacher") {
            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    blockList: (teachers[authed]?.blockList || []).concat([id])
                }
            };

            if (students[id]) {
                students = {
                    ...students,
                    [id]: {
                        ...students[id],
                        active: false
                    }
                };
            }
        } else if (students[authed]) {
            students = {
                ...students,
                [authed]: {
                    ...students[authed],
                    blockList: (students[authed]?.blockList || []).concat([id])
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('teachers', teachers);
        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function saveUnblocks({
        id,
        authed
    }) {
    return new Promise((res) => {
        users = getSessionData('users', users);
        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);

        if (users[authed] && users[authed].description === "teacher") {
            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    blockList: (teachers[authed]?.blockList || []).filter((i) => i !== id)
                }
            };

            if (students[id]) {
                students = {
                    ...students,
                    [id]: {
                        ...students[id],
                        active: true
                    }
                };
            }
        } else if (students[authed]) {
            students = {
                ...students,
                [authed]: {
                    ...students[authed],
                    blockList: (students[authed]?.blockList || []).filter((i) => i !== id)
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('teachers', teachers);
        setSessionData('students', students);
        setSessionData('users', users);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function saveEvaluations({
        id,
        authed,
        status,
        name,
        avatar,
        report
    }) {
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
                    teacher: {
                        name,
                        avatar
                    },
                    report
                }
            };
        }

        if (teachers[authed]) {
            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    evaluatedRecitations: (teachers[authed]?.evaluatedRecitations || []).concat([id])
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('recitations', recitations);
        setSessionData('teachers', teachers);
        setSessionData('users', users);

        setTimeout(() => {
            res(id);
        }, 200);
    });
}

export function saveTeacherEvaluation({id, status}) {
    return new Promise((res) => {
        teachers = getSessionData('teachers', teachers);
        students = getSessionData('students', students);

        if (teachers[id]) {
            teachers = {
                ...teachers,
                [id]: {
                    ...teachers[id],
                    status
                }
            };
        }

        users = {
            ...teachers,
            ...students
        };

        setSessionData('teachers', teachers);
        setSessionData('users', users);

        setTimeout(() => {
            res(id, status);
        }, 200);
    });
}