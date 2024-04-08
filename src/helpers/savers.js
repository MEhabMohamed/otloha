let recitations = {};

let teachers = {};

let students = {};

let users = {};

let admins = {
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

export const getInitialData = async () => {
    return Promise.all([
      getRecitations(),
      getUsers(),
      getAdmins(),
      getStudents(),
      getTeachers()
    ]).then(([recitations, users, admins, students, teachers]) => ({
        recitations,
        users,
        admins,
        students,
        teachers
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

function formatRecitation ({verse, narration, playback, authed}) {
    return {
        verse,
        narration,
        playback,
        authed,
        id: generateUID().replace(/[0-9]/g, 'k'),
        status: "Pending",
        rating: 0,
        createdAt: Date.now(),
        evaluatedAt: "",
        teacher: {
            name: "",
            avatar: ""
        },
        remarkable: false,
        report: ""
    }
}

function formatTeacher ({id, name, password, country, description, email, gender, avatar, due, lang, bDate}) {
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
        recitations: [],
        evaluatedRecitations: [],
        joiningDate: Date.now(),
        verified: false,
        level: 'Beginner',
        active: true,
        rating: 0,
        earnings: [0.00],
        dues: [0.00],
        blockList: []
    }
}

function formatStudent ({id, name, password, country, description, narration, email, gender, avatar, lang, bDate}) {
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
        recitations: [],
        joiningDate: Date.now(),
        verified: false,
        level: 'Beginner',
        active: true,
        rating: 0,
        blockList: []
    }
}

function formatAdmin({email}) {
    return {
        id: email.split('@')[0].replace(/\s+/g, '').trim().toLowerCase(),
        email,
    }
}

export function saveRecitations({verse, narration, playback, authed}) {
    return new Promise((res,rej) => {
        const formattedRecitation = formatRecitation({
            verse,
            narration,
            playback,
            authed
        })
        setTimeout(() => {

            recitations = {
                ...recitations,
                [formattedRecitation.id]: formattedRecitation
            }

            users[authed].description === "teacher" ?
            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    recitations: teachers[authed].recitations.concat([formattedRecitation.id])
                }
            } : students = {
                ...students,
                [authed]: {
                    ...students[authed],
                    recitations: students[authed].recitations.concat([formattedRecitation.id])
                }
            };

            users = {
                ...teachers,
                ...students
            }

            res(formattedRecitation)
        }, 1000)
    })
}

export function saveStudent({id, name, password, country, narration, description, email, gender, avatar, lang, bDate}) {
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

            res(formattedUser)
        }, 1000)
    })
}

export function saveTeacher({id, name, password, country, description, email, gender, avatar, due, lang, bDate}) {
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

            res(formattedAdmin)
        }, 1000)
    })
}

export function savePasses ({id , password}) {
    return new Promise((res,rej) => {
        
        setTimeout(() => {

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

            res(password)
        }, 1000)
    })
}

export function savePics ({id , pic}) {
    return new Promise((res,rej) => {
        
        setTimeout(() => {

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

            res(pic)
        }, 1000)
    })
}

export function saveBlocks({ id , authed }) {
    return new Promise((res,rej) => {

        setTimeout(() => {

            users[authed].description === "teacher" ?
            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    blockList: teachers[authed].blockList.concat([id])
                }
            } : students = {
                ...students,
                [authed]: {
                    ...students[authed],
                    blockList: students[authed].blockList.concat([id])
                }
            };

            users = {
                ...teachers,
                ...students
            }

            res(id)
        }, 1000)
    })
}

export function saveEvaluations({ id , authed , status , name , report }) {
    return new Promise((res,rej) => {

        setTimeout(() => {

            recitations = {
                ...recitations,
                [id]: {
                    ...recitations[id],
                    evaluatedAt: Date.now(),
                    status: status,
                    teacher: {
                        name: name,
                    },
                    report
                }
            }

            teachers = {
                ...teachers,
                [authed]: {
                    ...teachers[authed],
                    evaluatedRecitations: teachers[authed].evaluatedRecitations.concat([id])
                }
            }

            users = {
                ...teachers,
                ...students
            }

            res(id)
        }, 1000)
    })
}

