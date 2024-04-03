export default function showPass(p) {
    if (document.querySelector(`#${p}`).type === 'password') {
        return document.querySelector(`#${p}`).type = 'text'
    }
    else { 
        document.querySelector(`#${p}`).type = 'password'
    }
}