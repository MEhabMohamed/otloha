import $ from "jquery";
import AlertShow from "../Alert/AlertShow";

export default function validateUser(
        usermails,
        users,
        email,
        pass,
        dispatch,
        setAuthedUser,
        navigate,
        setEmailValidateAlert,
        setPassValidateAlert
    ) {
    const id = email.split('@')[0].replace(/\s+/g, '').trim().toLowerCase();
    if (usermails.includes(email)) {
        if (users[id].password === pass) {
            dispatch(setAuthedUser(id));
            navigate('/');
            $('#get-pic').show();
        } else {
            AlertShow(
                $('#pass-validate-alert'),
                setPassValidateAlert,
                "Wrong password, please try again!"
            )
        }
    } else {
        AlertShow(
            $('#email-validate-alert'),
            setEmailValidateAlert,
            "Invalid user!"
        )
    }
}