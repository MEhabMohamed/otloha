import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Grid , TextField } from "@mui/material";
import PaginationLink from "../Component Libraries/Pagination/Pagination";
import DataBlock from "../Component Libraries/DataBlock/DataBlock";
import accept from '../Resources/accept.png';
import report from '../Resources/report.png';
import reject from '../Resources/reject.png';
import mushaf from '../Resources/mushaf.png';
import star from '../Resources/star-light.png';
import DatePick from "../Component Libraries/Date/DatePicker";
import SearchIcon from '@mui/icons-material/Search';
import $ from "jquery";
import FilteredRecitation from "../Component Libraries/Recitation/FilteredRecitation";
import FilterSelector from "../Component Libraries/Recitation/FilterSelector";

function RecitationDashboard ({users, recitations}) {

    let [search, setSearch] = useState('');
    let [fromDate, setFromDate] = useState(null);
    let [toDate, setToDate] = useState(null);
    let [evaluatedFrom, setEvaluatedFrom] = useState(null);
    let [evaluatedto, setEvaluatedTo] = useState(null);
    let [reciteFilter, setReciteFilter] = useState(null);
    let [reciteFilterSelector, setReciteFilterSelector] = useState("");
    let [currentPage, setCurrentPage] = useState(1);
    let lastIndex = currentPage * 10;
    let firstIndex = lastIndex - 10;
    
    let recites = Object.keys(recitations)
    .sort((a, b,) => recitations[b].createdAt - recitations[a].createdAt)
    let evals = Object.values(recitations)

    function teacherRating( id , stars ) {

        return {
            rating: recitations[id].raters.length > 0
            ? (recitations[id].raters.filter(({raterId , rating}) =>
            ((users[raterId].description === "teacher")
            && (rating === stars))).length > 0 && id) : !id
        }
    }

    function filteredRecites() {
        return {
            recitations: recites.filter((id) =>
            search !== "" ?
            users[recitations[id].authed].name.toLowerCase().includes(search)
            : id)
            .filter((id) => fromDate !== null
            ? Date.parse(fromDate) <= recitations[id].createdAt
            : id)
            .filter((id) => evaluatedto !== null
            ? recitations[id].evaluatedAt <= Date.parse(evaluatedto)
            : id)
            .filter((id) => evaluatedFrom !== null
            ? Date.parse(evaluatedFrom) <= recitations[id].evaluatedAt
            : id)
            .filter((id) => toDate !== null
            ? recitations[id].createdAt <= Date.parse(toDate)
            : id)
            .filter((id) => {
                switch(reciteFilter) {
                    case "Accepted":
                        return recitations[id].status === "Accepted"
                    case "Rejected":
                        return recitations[id].status === "Rejected"
                    case "Reported":
                        return recitations[id].status === "Reported"
                    case "Remarkable":
                        return recitations[id].remarkable
                    default:
                        return id
                }
            })
            .filter((id) => {
                switch(reciteFilterSelector) {
                    case "Not Remarkable":
                        return !recitations[id].remarkable
                    case "Teacher recitation":
                        return users[recitations[id].authed].description === "teacher"
                    case "Not Teacher recitation":
                        return users[recitations[id].authed].description !== "teacher"
                    case "Evaluated":
                        return users[recitations[id].authed].description !== "teacher"
                        ? recitations[id].status !== "Pending" : !id
                    case "Not Evaluated":
                        return users[recitations[id].authed].description !== "teacher"
                        ? recitations[id].status === "Pending" : !id
                    case "Teacher Rated 5 stars":
                        return teacherRating(id , 5).rating
                    case "Teacher Rated 4 stars":
                        return teacherRating(id , 4).rating
                    case "Teacher Rated 3 stars":
                        return teacherRating(id , 3).rating
                    case "Teacher Rated 2 stars":
                        return teacherRating(id , 2).rating
                    case "Teacher Rated 1 star":
                        return teacherRating(id , 1).rating
                    default:
                        return id
                }
            })
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
                md={12}
                spacing={1}
                justifyContent="center"
            >
                <DataBlock
                    size={2.4}
                    pic={mushaf}
                    text="All Recitations"
                    counter={evals.length}
                    handleClick={() => {
                        setReciteFilter(null);
                        setReciteFilterSelector('');
                    }}
                />
                <DataBlock
                    size={2.4}
                    pic={accept}
                    text="Accepted"
                    counter={evals.filter(({status}) => status === "Accepted").length}
                    handleClick={() => setReciteFilter("Accepted")}
                />
                <DataBlock
                    size={2.4}
                    pic={reject}
                    text="Rejected"
                    counter={evals.filter(({status}) => status === "Rejected").length}
                    handleClick={() => setReciteFilter("Rejected")}
                />
                <DataBlock
                    size={2.4}
                    pic={report}
                    text="Reported"
                    counter={evals.filter(({status}) => status === "Reported").length}
                    handleClick={() => setReciteFilter("Reported")}
                />
                <DataBlock
                    size={2.4}
                    pic={star}
                    text="Remarkable"
                    counter={evals.filter(({remarkable}) => remarkable).length}
                    handleClick={() => setReciteFilter("Remarkable")}
                />
            </Grid>
            <Grid
                item
                xs={12}
                sm={12}
                container
                spacing={1}
                direction="column"
            >
                <Grid
                    item
                    container
                    spacing={1}
                    sx={{
                        gap: 1
                    }}
                    justifyContent="right"
                >
                    <Grid
                        item
                        md={2}
                        sx={{
                            width: "100%"
                        }}
                    >
                        <FilterSelector
                            filter={reciteFilterSelector}
                            setter={setReciteFilterSelector}
                            identify="recitation-dashboard"
                        />
                    </Grid>
                    <Grid
                        item
                        md={4.6}
                        xs={12}
                    >
                        <TextField
                            id="recitation-search"
                            label="search"
                            name="search"
                            fullWidth
                            autoComplete="search-feild"
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                        />
                        <SearchIcon
                            sx={{
                                position: "absolute",
                                my: 1,
                                mx: -4.5
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        md={2}
                    >
                        <DatePick
                            value={fromDate}
                            choose={setFromDate}
                            label="Created at..."
                            setWidth="auto"
                        />
                    </Grid>
                    <Grid
                        item
                        md={2}
                    >
                        <DatePick
                            value={toDate}
                            choose={setToDate}
                            label="Up to..."
                            setWidth="auto"
                        />
                    </Grid>
                    <Grid
                        item
                        md={1}
                    >
                        <Button
                            variant="contained"
                            type="submit"
                            size="medium"
                            onClick={() => {
                                setFromDate(null);
                                setToDate(null);
                                setSearch('');
                                setReciteFilter(null);
                                setReciteFilterSelector("");
                                $("#recitation-search").val('');
                            }}
                        >
                            Reset
                        </Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    item
                    spacing={1}
                    mb={1}
                >
                    <Grid
                        item
                        md={2.9}
                    >
                        <DatePick
                            value={evaluatedFrom}
                            choose={setEvaluatedFrom}
                            label="Evaluated at..."
                            setWidth="auto"
                        />
                    </Grid>
                    <Grid
                        item
                        md={2.9}
                    >
                        <DatePick
                            value={evaluatedto}
                            choose={setEvaluatedTo}
                            label="Up to..."
                            setWidth="auto"
                        />
                    </Grid>
                </Grid>
                    <FilteredRecitation
                        recitations={
                            filteredRecites().recitations
                            }
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                    />
                <Grid item>
                    <PaginationLink
                        showing={Math.ceil(filteredRecites().recitations.length/10)}
                        pageSet={setCurrentPage}
                        firstIndex={firstIndex}
                        lastIndex={lastIndex}
                        total={filteredRecites().recitations.length}
                        />
                </Grid>
            </Grid>
        </Grid>
    )
}

function mapStateToProps({users, recitations}) {
    return {
        users,
        recitations
    }
}

export default connect(mapStateToProps)(RecitationDashboard)