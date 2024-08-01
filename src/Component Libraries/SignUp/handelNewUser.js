import $ from "jquery";
import AlertShow from "../Alert/AlertShow";

export default function handleNewUser(
        username,
        pass,
        country,
        type,
        email,
        avatar,
        gender,
        dispatch,
        navigate,
        handleAddUser,
        extra,
        setUserAlert,
        setPassAlert,
        lang,
        bDate
    ) {
    const id = email.split('@')[0].replace(/\s+/g, '').trim().toLowerCase();
    if ((username !== '') && (pass !== '') 
    && (email !== '') && (country !== null) && (bDate !== null)) {
        if (pass.length < 8) {
            AlertShow($('#pass-alert'), setPassAlert, "Please use min 8 characters!");
            } else {
            dispatch(handleAddUser(
                id,
                username,
                pass,
                country,
                type,
                email,
                gender,
                avatar,
                extra,
                lang,
                bDate
            ))
            .then(navigate('/'));
        }
    } else {
        AlertShow($('#email-alert'), setUserAlert, "Please complete inputs!");
    } return ($('#signup-show-pass').hide())
};