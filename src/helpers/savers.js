let recitations = localStorage.getItem("recitations") !== null
? JSON.parse(localStorage.getItem("recitations")) : {};

let teachers = localStorage.getItem("teachers") !== null
? JSON.parse(localStorage.getItem("teachers")) : {};

let students = localStorage.getItem("students") !== null
? JSON.parse(localStorage.getItem("students")) : {};

let users = localStorage.getItem("users") !== null
? JSON.parse(localStorage.getItem("users")) : {};

let tajweed = localStorage.getItem("tajweed") !== null
? JSON.parse(localStorage.getItem("tajweed")) : {levels: {}, lessons: {}};

let levels = localStorage.getItem("levels") !== null
? JSON.parse(localStorage.getItem("levels")) : {};

let lessons = localStorage.getItem("lessons") !== null
? JSON.parse(localStorage.getItem("lessons")) : {};

let admins = localStorage.getItem("admins") !== null
? JSON.parse(localStorage.getItem("admins")) : {
   mohamedelenna90: {
        email: 'mohamedelenna90@gmail.com',
        id: 'mohamedelenna90'
    }
};

export function getRecitations() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...recitations}), 1000)
    })
}

export function getUsers() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...users}), 1000)
    })
}

export function getTeachers() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...teachers}), 1000)
    })
}

export function getStudents() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...students}), 1000)
    })
}

export function getAdmins() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...admins}), 1000)
    })
}

export function getTajweeds() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...tajweed}), 1000)
    })
}

export function getLevels() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...levels}), 1000)
    })
}

export function getLessons() {
    return new Promise((res, rej) => {
        setTimeout(() => res({...lessons}), 1000)
    })
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
    }))
}

function generateUID () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function formatDate (timestamp) {
    const d = new Date(timestamp)
    const time = d.toLocaleTimeString('en-ME')
    return time.replace(0, 5) + ' | ' + d.toLocaleDateString()
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
    }
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
}
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
    }
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
    }
}

function formatAdmin({email}) {
    return {
        id: email.split('@')[0].replace(/\s+/g, '').trim().toLowerCase(),
        email,
    }
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
    }
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
    }
}

export function saveLevels({
    name,
    color,
    value
}) {
    return new Promise((res, rej) => {
        let formattedLevel;

        formattedLevel = formatLevel({
            name,
            color,
            value
        })

        setTimeout(() => {

            levels = {
                ...levels,
                [formattedLevel.id]: formattedLevel
            }

            tajweed = {
                lessons: {
                    ...lessons
                },
                levels: {
                    ...levels
                }
            }

            localStorage.setItem("tajweed", JSON.stringify({
                ...tajweed
            }))

            res(formattedLevel)
        }, 1000)
    })
}

export function saveLessons({
    title,
    content,
    level,
    parentLesson
}) {
    return new Promise((res, rej) => {
        let formattedLesson;

        formattedLesson = formatLesson({
            title,
            content,
            level,
            parentLesson
        })

        setTimeout(() => {

            lessons = {
                ...lessons,
                [formattedLesson.id]: formattedLesson
            }

            tajweed = {
                lessons: {
                    ...lessons
                },
                levels: {
                    ...levels
                }
            }

            localStorage.setItem("tajweed", JSON.stringify({
                ...tajweed
            }))

            res(formattedLesson)
        }, 1000)
    })
}

export function saveEditLessons ({id, title, content, level, parentLesson}) {
    return new Promise((res,rej) => {
        setTimeout(() => {

            lessons = {
                ...lessons,
                [id]: {
                    ...lessons[id],
                    title,
                    content,
                    level,
                    parentLesson
                }
            }

            localStorage.setItem("lessons", JSON.stringify(lessons))

            tajweed = {
                lessons: {
                    ...lessons
                },
                levels: {
                    ...levels
                }
            }

            localStorage.setItem("tajweed", JSON.stringify({
                ...tajweed
            }))

            res(id)
        }, 1000)
    })
}

export function saveEditLevels ({id, name, color, value}) {
    return new Promise((res,rej) => {
        setTimeout(() => {

            levels = {
                ...levels,
                [id]: {
                    ...levels[id],
                    name,
                    color,
                    value
                }
            }

            localStorage.setItem("levels", JSON.stringify(levels))

            tajweed = {
                lessons: {
                    ...lessons
                },
                levels: {
                    ...levels
                }
            }

            localStorage.setItem("tajweed", JSON.stringify({
                ...tajweed
            }))

            res(id)
        }, 1000)
    })
}

export function deleteLevels ({id}) {
    return new Promise((res,rej) => {
        setTimeout(() => {

            levels = Object
            .fromEntries(Object.entries(levels).filter(e => e[0] !== id))

            localStorage.setItem("levels", JSON.stringify(levels))

            tajweed = {
                lessons: {
                    ...lessons
                },
                levels: {
                    ...levels
                }
            }

            localStorage.setItem("tajweed", JSON.stringify({
                ...tajweed
            }))

            res(id)
        }, 1000)
    })
}

export function deleteLessons ({id}) {
    return new Promise((res,rej) => {
        setTimeout(() => {

            lessons = Object
            .fromEntries(Object.entries(lessons).filter(e => e[0] !== id))

            localStorage.setItem("lessons", JSON.stringify(lessons))

            tajweed = {
                lessons: {
                    ...lessons
                },
                levels: {
                    ...levels
                }
            }

            localStorage.setItem("tajweed", JSON.stringify({
                ...tajweed
            }))

            res(id)
        }, 1000)
    })
}

export function saveRecitations({
        verse,
        narration,
        playback,
        authed
    }) {
    return new Promise((res,rej) => {

        let formattedRecitation;

        let users = JSON.parse(localStorage.getItem("users"));
        let recitations = JSON.parse(localStorage.getItem("recitations"));

        users[authed].description === "teacher" ?

        formattedRecitation = formatTeacherRecitation({
            verse,
            narration,
            playback,
            authed,
        }) : formattedRecitation = formatStudentRecitation({
            verse,
            narration,
            playback,
            authed,
        })

        setTimeout(() => {

            recitations = {
                ...recitations,
                [formattedRecitation.id]: formattedRecitation
            }

            localStorage.setItem("recitations", JSON.stringify({
                ...recitations,
                [formattedRecitation.id]: formattedRecitation
            }))

            users[authed].description === "teacher" ?
            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    recitations: teachers[authed].recitations
                    .concat([formattedRecitation.id])
                }
            } : students = {
                ...students,
                [authed]: {
                    ...students[authed],
                    recitations: students[authed].recitations
                    .concat([formattedRecitation.id])
                }
            };

            users = {
                ...teachers,
                ...students
            }

            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(formattedRecitation)
        }, 1000)
    })
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
    return new Promise((res, rej) => {
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
        })

        setTimeout(() => {
            students = {
                ...students,
                [formattedUser.id]: formattedUser
            }

            users = {
                ...students,
                ...teachers
            }

            localStorage.setItem("students", JSON.stringify({
                ...students,
            }))

            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(formattedUser)
        }, 1000)
    })
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
    return new Promise((res,rej) => {
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
            })

            setTimeout(() => {
                teachers = {
                    ...teachers,
                    [formattedUser.id]: formattedUser
                }

                users = {
                    ...students,
                    ...teachers
                }

                localStorage.setItem("teachers", JSON.stringify({
                    ...teachers
                }))

                localStorage.setItem("users", JSON.stringify({
                    ...students,
                    ...teachers
                }))
    
                res(formattedUser)
            }, 1000)
    })
}

export function saveAdmins ({email}) {
    return new Promise((res,rej) => {
        const formattedAdmin = formatAdmin({
            email
        })
        setTimeout(() => {
            admins = {
                ...admins,
                [formattedAdmin.id]: formattedAdmin
            }

            localStorage.setItem("admins", JSON.stringify({
                ...admins,
                [formattedAdmin.id]: formattedAdmin
            }))

            res(formattedAdmin)
        }, 1000)
    })
}

export function deleteAdmins ({id}) {
    return new Promise((res,rej) => {
        setTimeout(() => {

            admins = Object
            .fromEntries(Object.entries(admins).filter(e => e[0] !== id))

            localStorage.setItem("admins", JSON.stringify(Object
                .fromEntries(Object.entries(admins).filter(e => e[0] !== id))))

            res(id)
        }, 1000)
    })
}

export function savePasses ({
        id,
        password
    }) {
    return new Promise((res,rej) => {
        
        setTimeout(() => {

            let users = JSON.parse(localStorage.getItem("users"));
            let teachers = JSON.parse(localStorage.getItem("teachers"));
            let students = JSON.parse(localStorage.getItem("students"));

            users[id].description === "teacher" ?
            teachers = {
                ...teachers,
                [id]: {
                    ...teachers[id],
                    password: password
                }
            } : students = {
                ...students,
                [id]: {
                    ...students[id],
                    password: password
                }
            };

            users = {
                ...teachers,
                ...students
            }

            users[id].description === "teacher" ?

            localStorage.setItem("teachers", JSON.stringify({
                ...teachers
            })) : localStorage.setItem("students", JSON.stringify({
                ...students,
            }))


            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(password)
        }, 1000)
    })
}

export function saveUserRatings ({
    raterId,
    ratedId,
    rating
}) {
return new Promise((res,rej) => {
    
    setTimeout(() => {

        let users = JSON.parse(localStorage.getItem("users"));
        let teachers = JSON.parse(localStorage.getItem("teachers"));
        let students = JSON.parse(localStorage.getItem("students"));

        users[ratedId].description === "teacher" ?
        teachers = {
            ...teachers,
            [ratedId]: {
                ...teachers[ratedId],
                raters: teachers[ratedId].raters.concat([{raterId, rating}]),
            },
        } : students = {
            ...students,
            [ratedId]: {
                ...students[ratedId],
                raters: students[ratedId].raters.concat([{raterId, rating}]),
            }
        };

        users[raterId].description === "teacher" ?
        teachers = {
            ...teachers,
            [raterId]: {
                ...teachers[raterId],
                rated: teachers[raterId].rated.concat([ratedId])
            },
        } : students = {
            ...students,
            [raterId]: {
                ...students[raterId],
                rated: students[raterId].rated.concat([ratedId])
            }
        };

        users = {
            ...teachers,
            ...students
        }

        users[ratedId].description === "teacher" ?

        localStorage.setItem("teachers", JSON.stringify({
            ...teachers
        })) : localStorage.setItem("students", JSON.stringify({
            ...students,
        }))

        localStorage.setItem("users", JSON.stringify({
            ...students,
            ...teachers
        }))

        res(raterId, ratedId, rating)
    }, 1000)
})
}

export function saveRecitationRatings ({
    raterId,
    ratedId,
    rating
}) {
return new Promise((res,rej) => {
    
    setTimeout(() => {

        let recitations = JSON.parse(localStorage.getItem("recitations"));

        recitations = {
            ...recitations,
            [ratedId]: {
                ...recitations[ratedId],
                raters: recitations[ratedId].raters.concat([{raterId, rating}]),
            }
        }

        localStorage.setItem("recitations", JSON.stringify({
            ...recitations,
            [ratedId]: {
                ...recitations[ratedId],
                raters: recitations[ratedId].raters.concat([{raterId, rating}]),
            }
        }))

        let users = JSON.parse(localStorage.getItem("users"));
        let teachers = JSON.parse(localStorage.getItem("teachers"));
        let students = JSON.parse(localStorage.getItem("students"));

        users[raterId].description === "teacher" ?
        teachers = {
            ...teachers,
            [raterId]: {
                ...teachers[raterId],
                ratedRecitations: teachers[raterId].ratedRecitations
                .concat([ratedId])
            }
        } : students = {
            ...students,
            [raterId]: {
                ...students[raterId],
                ratedRecitations: students[raterId].ratedRecitations
                .concat([ratedId])
            }
        }

        users = {
            ...teachers,
            ...students
        }

        users[ratedId].description === "teacher" ?

        localStorage.setItem("teachers", JSON.stringify({
            ...teachers
        })) : localStorage.setItem("students", JSON.stringify({
            ...students,
        }))

        localStorage.setItem("users", JSON.stringify({
            ...students,
            ...teachers
        }))

        res(raterId, ratedId, rating)
    }, 1000)
})
}

export function savePics({
        id,
        pic
    }) {
    return new Promise((res,rej) => {
        
        setTimeout(() => {

            let users = JSON.parse(localStorage.getItem("users"));
            let teachers = JSON.parse(localStorage.getItem("teachers"));
            let students = JSON.parse(localStorage.getItem("students"));

            users[id].description === "teacher" ?
            teachers = {
                ...teachers,
                [id]: {
                    ...teachers[id],
                    avatar: pic
                }
            } : students = {
                ...students,
                [id]: {
                    ...students[id],
                    avatar: pic
                }
            };

            users = {
                ...teachers,
                ...students
            }

            users[id].description === "teacher" ?

            localStorage.setItem("teachers", JSON.stringify({
                ...teachers
            })) : localStorage.setItem("students", JSON.stringify({
                ...students,
            }))

            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(pic)
        }, 1000)
    })
}

export function saveBlocks({
        id,
        authed
    }) {
    return new Promise((res,rej) => {

        setTimeout(() => {

            let users = JSON.parse(localStorage.getItem("users"));
            let teachers = JSON.parse(localStorage.getItem("teachers"));
            let students = JSON.parse(localStorage.getItem("students"));

            if (users[authed].description === "teacher") {

                teachers = {
                    ...teachers,
                    [authed]: {
                        ...teachers[authed],
                        blockList: teachers[authed].blockList.concat([id])
                    }
                };

                students = {
                    ...students,
                    [id]: {
                        ...students[id],
                        active: false
                    }
                }
            } else {
                students = {
                    ...students,
                    [authed]: {
                        ...students[authed],
                        blockList: students[authed].blockList.concat([id])
                    }
                }
            }

            users = {
                ...teachers,
                ...students
            }

            users[id].description === "teacher" ?

            localStorage.setItem("teachers", JSON.stringify({
                ...teachers
            })) : localStorage.setItem("students", JSON.stringify({
                ...students,
            }))

            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(id)
        }, 1000)
    })
}

export function saveUnblocks({
        id,
        authed
    }) {
    return new Promise((res,rej) => {

        setTimeout(() => {

            let users = JSON.parse(localStorage.getItem("users"));
            let teachers = JSON.parse(localStorage.getItem("teachers"));
            let students = JSON.parse(localStorage.getItem("students"));

            if (users[authed].description === "teacher") {

                teachers = {
                    ...teachers,
                    [authed]: {
                        ...teachers[authed],
                        blockList: teachers[authed].blockList.filter((i) => i !== id)
                    }
                };

                students = {
                    ...students,
                    [id]: {
                        ...students[id],
                        active: true
                    }
                }
            } else {
                students = {
                    ...students,
                    [authed]: {
                        ...students[authed],
                        blockList: students[authed].blockList.filter((i) => i !== id)
                    }
                }
            }

            users = {
                ...teachers,
                ...students
            }

            users[id].description === "teacher" ?

            localStorage.setItem("teachers", JSON.stringify({
                ...teachers
            })) : localStorage.setItem("students", JSON.stringify({
                ...students,
            }))

            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(id)
        }, 1000)
    })
}

export function saveEvaluations({
        id,
        authed,
        status,
        name,
        avatar,
        report
    }) {
    return new Promise((res,rej) => {

        setTimeout(() => {

            let recitations = JSON.parse(localStorage.getItem("recitations"));
            let teachers = JSON.parse(localStorage.getItem("teachers"));

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
            }

            localStorage.setItem("recitations", JSON.stringify({
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
            }))

            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    evaluatedRecitations: teachers[authed].evaluatedRecitations
                    .concat([id])
                }
            }

            users = {
                ...teachers,
                ...students
            }

            localStorage.setItem("teachers", JSON.stringify({
                ...teachers
            }))

            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(id)
        }, 1000)
    })
}

export function saveTeacherEvaluation({id, status}) {
    return new Promise((res, rej) => {

        setTimeout(() => {

            let teachers = JSON.parse(localStorage.getItem("teachers"));

            teachers = {
                ...teachers,
                [id]: {
                    ...teachers[id],
                    status
                }
            }

            users = {
                ...teachers,
                ...students
            }

            localStorage.setItem("teachers", JSON.stringify({
                ...teachers
            }))

            localStorage.setItem("users", JSON.stringify({
                ...students,
                ...teachers
            }))

            res(id, status)
        })
    }) 
}