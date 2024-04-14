import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Grid , TextField } from "@mui/material";
import Recitation from "../Component Libraries/Recitation/Recitation"
import PaginationLink from "../Component Libraries/Pagination/Pagination";
import DataBlock from "../Component Libraries/DataBlock/DataBlock";
import accept from '../Resources/accept.png';
import reject from '../Resources/reject.png';
import mushaf from '../Resources/mushaf.png';
import star from '../Resources/star.png';
import DatePick from "../Component Libraries/Date/DatePicker";
import $ from "jquery";

function RecitationDashboard ({ recitations , evals , users , recites }) {

    let [search, setSearch] = useState('');
    let [fromDate, setFromDate] = useState(null);
    let [toDate, setToDate] = useState(null);
    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;

    return (
        <Grid container id="recites-container" sx={{ pt: 12, px: 1}} spacing={1}>
            <Grid item container spacing={1} md={12}>
                <DataBlock size={3} pic={mushaf} text="All Recitations" counter={evals.length}/>
                <DataBlock size={3} pic={accept} text="Corrected" counter={evals.filter(({status}) => status !== "Pending").length}/>
                <DataBlock size={3} pic={star} text="Remarkable" counter={evals.filter(({remarkable}) => remarkable).length}/>
                <DataBlock size={3} pic={reject} text="Rejected" counter={evals.filter(({status}) => status === "Rejected").length}/>
            </Grid>
            <Grid item id="users-container" xs={12} sm={9} container spacing={1} direction="column">
                <Grid item container sx={{ gap: 1 }}>
                    <Grid item sm={5.3}>
                        <TextField
                        id="recitation-search"
                        label="search"
                        name="search"
                        fullWidth
                        autoComplete="search-feild"
                        onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>
                    <DatePick value={fromDate} choose={setFromDate} label="Created at..." setWidth={160}/>
                    <DatePick value={toDate} choose={setToDate} label="Up to..." setWidth={160}/>
                    <Button
                    variant="contained"
                    type="submit"
                    size="medium"
                    onClick={() => {
                        setFromDate(null);
                        setToDate(null);
                        setSearch('');
                        $("#recitation-search").val('')
                    }}
                        >
                        Reset
                    </Button>
                </Grid>
                {recites.filter((id) => search !== null ? 
                users[recitations[id].authed].name.toLowerCase().includes(search) 
                : id)
                .filter((id) => fromDate !== null ?
                 Date.parse(fromDate) <= recitations[id].createdAt 
                 : id)
                 .filter((id) => toDate !== null ? recitations[id].createdAt <= Date.parse(toDate)
                 : id)
                .map((id, index) => (
                    <Grid key={id} id={id} item>
                        <Recitation id={id} index={recites.length - index} />
                    </Grid>
                )).slice(firstIndex, lastIndex)
                }
                <Grid item>
                    <PaginationLink
                        showing={Math.ceil(recites.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={recites.length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
}

function mapStateToProps ({ users , authedUser , recitations }) {
    let recites = Object.keys(recitations)
    .sort((a, b,) => recitations[b].createdAt - recitations[a].createdAt)
    let evals = Object.values(recitations)
    return {
        users,
        authedUser: authedUser !== null ? authedUser[0] : null,
        recitations,
        evals,
        recites
    }
}

export default connect(mapStateToProps)(RecitationDashboard)