import React, { useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import $ from "jquery";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { handleEditPassword, handleEditPic } from "../../actions/user";
import eye from "../../Resources/eye.png";
import showPass from "../../helpers/showpass";
import readURL from "../../helpers/getPic";
import { Box, Stack, TextField } from "@mui/material";
import cam from "../../Resources/cam.jpg";
import male from "../../Resources/male.jpg";
import female from "../../Resources/female.jpeg";
import BasicAlerts from "../Alert/Alert";
import AlertShow from "../Alert/AlertShow";

function EditUser({ users , authedUser , widthSet}) {

    let ePass = useRef('');
    let [pass, setPass] = useState('');
    let newPic = useRef('');
    let [passAlert, setPassAlert] = useState('');
    const dispatch = useDispatch();
    ePass.current = pass;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (e) => {
        readURL(e.target, $('#editedPic'), $('#edited-get-pic'), {'width': '2rem',
        'height': '2rem',
        'position': 'absolute',
        'margin': '55px 0 auto 65px'})
        if (e.target.files[0] !== (undefined && "")) {
        newPic.current = e.target.files[0].name.slice(-4) === (".jpg" || ".png" || "jpeg")
        ? e.target.files[0] : "";
        e.target.files[0].name.slice(-4) === (".jpg" || ".png" || "jpeg")
        && dispatch(handleEditPic(authedUser, e.target.files[0]))
        }
    }

    function submitPassEditer(e) {
        e.preventDefault();
        if (ePass.current.length >= 8) {
            if (ePass.current === users[authedUser].password) {
                AlertShow($('#edit-pass-alert'), setPassAlert, "Password did not change!");
            } else {
            dispatch(handleEditPassword(authedUser, ePass.current));
            setPass('');
            handleClose();
            }
        } else {
            AlertShow($('#edit-pass-alert'), setPassAlert, "Please use min 8 characters!");
        };
    };

    return (
        <Stack
            id="edited-user-container"
            sx={{ width: widthSet }}
        >
            <Button
                id="edited-positioned-button"
                aria-controls={open ? 'edited-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="primary"
                variant="contained"
                size="small"
                fullWidth
            >
                Edit user
            </Button>
            <Menu
                id="edited-positioned-menu"
                aria-labelledby="edited-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                sx={{
                    px: 2
                }}
            >
                <MenuItem id="edited-pass-button">Edit user</MenuItem>
                    <MenuItem sx={{ justifyContent: "center" }}>
                        <img 
                            id="editedPic" 
                            src={users[authedUser].avatar !== ""
                            ? URL.createObjectURL(users[authedUser].avatar)
                            : (users[authedUser].gender === 'male' ? male : female)}
                            alt="no internet :(" 
                            style={{ borderRadius: '50%',
                            width: 80,
                            height: 80,
                            marginBottom: 2
                            }}
                        />
                        <Box
                            variant="contained"
                            component="label"
                            id='edited-get-pic'
                            sx={{
                                width: '2rem',
                                height: '2rem',
                                position: 'absolute',
                                margin: '55px 0 auto 65px',
                                borderRadius: '50%',
                                backgroundImage: `url(${cam})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                cursor: 'pointer',
                            }}
                            > 
                            <input
                                type="file"
                                hidden
                                onChange={handleChange}
                            />
                    </Box>
                    </MenuItem>
                    <MenuItem id="pass-change">
                        <img
                        src={eye}
                        id="edited-pass-show"
                        alt="show-password"
                        onClick={() => showPass('edited-new-pass')}
                        style={{
                            width: '15px',
                            height: '15px',
                            cursor: 'pointer',
                            position: 'absolute',
                            display: 'none'
                        }}/>
                        <TextField
                        required
                        name="password"
                        label="Password"
                        type="password"
                        id="edited-new-pass"
                        autoComplete="new-password"
                        sx={{
                            ml: 2,
                            mr: 3
                        }}
                        onChange={(e) => {
                            $('#edited-pass-show').show()
                            e.target.value === '' && $('#edited-pass-show').hide()
                            return setPass(e.target.value)}}
                        />
                    </MenuItem>
                    <MenuItem
                        sx={{ 
                            display: "none"
                        }}
                        id="edit-pass-alert"
                        >
                        <BasicAlerts
                        text={passAlert}
                        />
                    </MenuItem>
                    <MenuItem>
                            <Button 
                                id="submit-edited-pass"
                                color="primary"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mr: 2
                                }}
                                onClick={(e) => {
                                    submitPassEditer(e);
                                    $('#edited-new-pass').val('');
                                    $('#edited-pass-show').hide();
                                }}>
                                Edit
                            </Button>
                    </MenuItem>
            </Menu>
        </Stack>
    )
}

function mapStateToProps({ users , authedUser }) {
    return {
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
    }
}

export default connect(mapStateToProps)(EditUser)