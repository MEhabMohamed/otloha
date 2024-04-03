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
        evaluatedAt: ""
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

            users = {
                ...users,
                [authed]: {
                    ...users[authed],
                    recitations: users[authed].recitations.concat([formattedRecitation.id])
                }
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

