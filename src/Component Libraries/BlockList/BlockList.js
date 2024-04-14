import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Grid, Input, Paper, TextField, Typography } from "@mui/material";
import Teacher from "../Teacher/Teacher";
import Student from "../Student/Student";
import PaginationLink from "../Pagination/Pagination";
import $ from "jquery";
import { handleUnblock } from "../../actions/user";

function BlockList ({ authedUser , blockedUsers }) {

    let [search, setSearch] = useState("");
    let [userCheck, setUserCheck] = useState(false);
    let [check, setCheck] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    const dispatch = useDispatch();

    const handleCheck = () => {
        if (check === false) {
            setCheck(true)
            setUserCheck(true)
            blockedUsers
            .map(({id}) => $(`#choose-blocked-${id}`).prop("checked", true))
        } else {
            setCheck(false)
            setUserCheck(false)
            blockedUsers
            .map(({id}) => $(`#choose-blocked-${id}`).prop("checked", false))
        }
    }

    function filteredBlock() {
        return {
            blockedUser: blockedUsers
            .filter((block) => search !== "" ? 
            (block.email.includes(search) || block.name.toLowerCase().includes(search))
            : block),
            checked: blockedUsers
            .filter((blockedUser) => search !== "" ? 
            (blockedUser.email.includes(search) || blockedUser.name.toLowerCase().includes(search))
            : blockedUser)
            .slice(firstIndex, lastIndex)
            .filter(({id}) => document.querySelector(`#choose-blocked-${id}`) !== null ? document.querySelector(`#choose-blocked-${id}`).checked === true : id)
        }
    }

    return (
        <Grid container id="former-blocked-container" sx={{ pt: 12}}>
            <Grid item container id="blocked-container" xs={12} sm={8} ml={1} spacing={1} direction="column">
            <Paper
                    sx={{
                        height:60,
                        pt: 1,
                        px: 1,
                        width: "100%",
                        mt: 1,
                        ml: 1,
                    }}>
                    <Grid item container gap={1}>
                        <Grid item xs={0.25} sm={0.25} md={0.25} sx={{
                        textAlign: "center",
                        }}>
                            <Input
                                id="bulk-blocked-selector"
                                type="checkbox"
                                disableUnderline
                                onChange={handleCheck}
                                value={check}
                                />
                        </Grid>
                        <Grid item sm={5.6}>
                            <TextField
                            id="blocked-search"
                            label="search"
                            name="search"
                            fullWidth
                            autoComplete="search-feild"
                            onChange={(e) => setSearch(e.target.value)}
                            />
                        </Grid>
                        <Button
                        variant="contained"
                        type="submit"
                        size="medium"
                        onClick={() => {
                            setSearch('');
                            $("#blocked-search").val('')
                        }}
                            >
                            Reset
                        </Button>
                        {document.querySelector("#bulk-blocked-selector") !== null && (((document.querySelector("#bulk-blocked-selector").checked === true) || userCheck === true) && (
                            <Typography variant="body2" color="text.secondary">
                            {filteredBlock().checked.length} Selected
                        </Typography>))}
                        <Button
                            variant="contained"
                            type="submit"
                            size="medium"
                            onClick={() => {
                                filteredBlock().checked
                                .map(({id}) => dispatch(handleUnblock(id, authedUser)));
                                $("#bulk-blocked-selector").prop("checked", false);
                                setCheck(false);
                                setUserCheck(false);
                            }}
                        >
                            Unblock Selected
                        </Button>
                    </Grid>
                </Paper>
                {filteredBlock().blockedUser.map((user) => (user.description === "student" ?
                    <Grid key={user.id} id={`${user.id}-li`} item mb={1}>
                        <Student id={user.id} type="blocked" setValue={userCheck} setter={setUserCheck}/>
                    </Grid> : 
                    <Grid key={user.id} id={`${user.id}-li`} item mb={1}>
                        <Teacher id={user.id} type="blocked" setValue={userCheck} setter={setUserCheck}/>
                    </Grid>
                )).slice(firstIndex, lastIndex)}
                <Grid item>
                <PaginationLink
                        showing={Math.ceil(filteredBlock().blockedUser.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={filteredBlock().blockedUser.length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
};

function mapStateToProps ({ users , authedUser }) {
    let blocked = users[authedUser[0]].blockList;
    return {
        authedUser: authedUser !== null ? authedUser[0] : null,
        blockedUsers: blocked.map((block) => users[block])
    }
};

export default connect(mapStateToProps)(BlockList)