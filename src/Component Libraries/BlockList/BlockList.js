import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Grid, Input, Paper, TextField, Typography } from "@mui/material";
import Teacher from "../Teacher/Teacher";
import Student from "../Student/Student";
import PaginationLink from "../Pagination/Pagination";
import $ from "jquery";
import { handleUnblock } from "../../actions/user";

function BlockList () {

    let [search, setSearch] = useState("");
    let [userCheck, setUserCheck] = useState(false);
    let [check, setCheck] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    let authedUser = JSON.parse(localStorage.getItem("authedUser")) !== null ? 
    JSON.parse(localStorage.getItem("authedUser"))[0] : null;
    let users = JSON.parse(localStorage.getItem("users"));
    let blocked = users[authedUser].blockList;
    let blockedUsers = blocked.map((block) => users[block]);

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
            (blockedUser.email.includes(search)
            || blockedUser.name.toLowerCase().includes(search))
            : blockedUser)
            .slice(firstIndex, lastIndex)
            .filter(({id}) => document.querySelector(`#choose-blocked-${id}`) !== null
            ? document.querySelector(`#choose-blocked-${id}`).checked === true
            : id)
        }
    }

    return (
        <Grid
            container
            sx={{
                pt: 12,
                px: 1
            }}
            spacing={1}
        >
            <Grid
                item
                container
                direction="column"
            >
            <Paper
                sx={{
                    minHeight: 60,
                    pt: 1,
                    px: 1,
                    mt: 1,
                }}
            >
                <Grid
                    item
                    container
                    gap={1}
                    justifyContent="right"
                >
                    <Grid
                        item
                        xs={0.25}
                        sm={0.25}
                        md={0.25}
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Input
                            id="bulk-blocked-selector"
                            type="checkbox"
                            disableUnderline
                            onChange={handleCheck}
                            value={check}
                            />
                    </Grid>
                    <Grid item>
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
                    {document.querySelector("#bulk-blocked-selector") !== null
                    && ((
                    (document.querySelector("#bulk-blocked-selector").checked === true)
                    || userCheck === true) && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
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
                <Grid
                    key={user.id}
                    id={`${user.id}-li`}
                    item
                    mb={1}
                >
                    <Student
                        id={user.id}
                        type="blocked"
                        setValue={userCheck}
                        setter={setUserCheck}
                    />
                </Grid> : 
                <Grid
                    key={user.id}
                    id={`${user.id}-li`}
                    item
                    mb={1}
                >
                    <Teacher
                        id={user.id}
                        type="blocked"
                        setValue={userCheck}
                        setter={setUserCheck}
                    />
                </Grid>
            )).slice(firstIndex, lastIndex)}
            <Grid item mt={1}>
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

export default connect()(BlockList)