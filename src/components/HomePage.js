import React, { useState } from "react";
import { connect } from "react-redux";
import { Grid } from "@mui/material";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { WorldMap } from "react-svg-worldmap";
import { countries } from "../Component Libraries/CountrySelect/Countries";
import DatePick from "../Component Libraries/Date/DatePicker";
import CountrySelector from "../Component Libraries/CountrySelect/CountrySelector";
import Locales from "../Component Libraries/Language/Language";
import GenderSelect from "../Component Libraries/GenderSelect/GenderSelect";
import HomeData from "../Component Libraries/HomeData/HomeData";

function HomePage ({ theme, users, recitations }) {

    let [fromDate, setFromDate] = useState(null);
    let [toDate, setToDate] = useState(null);
    let [filteredCountry, setCountry] = useState(null);
    let [lang, setLang] = useState('arEG');
    let [gender , setGender] = useState('');

    function filteredUser() {
        return {
            filtered: Object.values(users)
            .filter((user) => fromDate !== null
            ? user.bDate >= Date.parse(fromDate)
            : user)
            .filter((user) => toDate !== null
            ? user.bDate <= Date.parse(toDate)
            : user)
            .filter((user) => ((filteredCountry === null) || (filteredCountry === ''))
            ? user
            : user.country === filteredCountry)
            .filter((user) => lang !== 'arEG'
            ? user.lang === lang
            : user)
            .filter((user) => gender !== ""
            ? user.gender === gender
            : user),
            teachers: Object.values(users)
            .filter((user) => fromDate !== null
            ? user.bDate >= Date.parse(fromDate)
            : user)
            .filter((user) => toDate !== null ?
            user.bDate <= Date.parse(toDate)
            : user)
            .filter((user) => ((filteredCountry === null) || (filteredCountry === ''))
            ? user
            : user.country === filteredCountry)
            .filter((user) => lang !== 'arEG' ?
            user.lang === lang
            : user)
            .filter((user) => gender !== ""
            ? user.gender === gender
            : user)
            .filter((user) => user.description === "teacher"),
            students: Object.values(users)
            .filter((user) => fromDate !== null
            ? user.bDate >= Date.parse(fromDate)
            : user)
            .filter((user) => toDate !== null
            ? user.bDate <= Date.parse(toDate)
            : user)
            .filter((user) => ((filteredCountry === null) || (filteredCountry === ''))
            ? user
            : user.country === filteredCountry)
            .filter((user) => lang !== 'arEG'
            ? user.lang === lang
            : user)
            .filter((user) => gender !== ""
            ? user.gender === gender
            : user)
            .filter((user) => user.description === "student"),
        }
    }

    const countriesData = countries.map(({code}) => {
        return {
        country: code.toLowerCase(),
        value: filteredUser().filtered.filter((user) =>
        user.country.code.toLowerCase() === code.toLowerCase()).length
        }
    })

    return (
        <Grid container id="former-user-container" sx={{
                pt: 12,
                px: {
                    md: 2
                },
                gap: 2,
            }}>
            <Grid
                item
                container
                md={12}
                gap={2}
                sx={{
                    justifyContent: {
                        md: "right",
                        xs: "center"
                    },
                }}
            >
                <DatePick
                    value={fromDate}
                    choose={setFromDate}
                    label="Birth Date From..."
                    setWidth={160}
                />
                <DatePick
                    value={toDate}
                    choose={setToDate}
                    label="Up to..."
                    setWidth={160}
                />
                <CountrySelector
                    value={filteredCountry}
                    select={setCountry}
                    identify="homepage"
                />
                <Locales
                    value={lang}
                    select={setLang}
                />
                <GenderSelect
                    gender={gender}
                    setter={setGender}
                />
                <Button
                    variant="contained"
                    type="submit"
                    size="medium"
                    onClick={() => {
                        setCountry(null);
                        setFromDate(null);
                        setToDate(null);
                        setLang('arEG');
                        setGender('');
                    }}
                >
                    Reset
                </Button>
            </Grid>
            <Grid
                item
                md={5}
                sm={12}
                textAlign="center"
                justifyContent="center"
            >
                <Paper
                    sx={{
                        borderRadius: "47%",
                        px: {
                            md: 0,
                            sm: 3,
                            xs: 1
                        },
                        py: {
                            md: 6,
                            sm: 3,
                            xs: 3
                        }
                    }}
                >
                    <WorldMap
                        color={theme === "light" ? "#10B981" : "#34D399"}
                        value-suffix="people"
                        backgroundColor="transparent"
                        size="md"
                        data={countriesData}
                    />
                </Paper>
            </Grid>
            <Grid
                item
                container
                md={6.7}
                sm={12}
                gap={2}
            >
                <HomeData
                    count={filteredUser().filtered.length}
                    label={filteredUser().filtered.length === 1 ? "User" : "Users"}
                    size={5.7}
                    data={[
                        {
                            id: 0,
                            value: filteredUser().students.length,
                            label: 'Students',
                            color: theme === "light"
                            ? "#D97706"
                            : "#FBBF24"
                        },
                        {
                            id: 1,
                            value: filteredUser().teachers.length,
                            label: 'Teachers' ,
                            color: theme === "light"
                            ? "#059669"
                            : "#34D399"
                        },
                    ]}
                />
                <HomeData
                    count={filteredUser().teachers.length}
                    label={filteredUser().teachers.length === 1
                    ? "Teacher"
                    : "Teachers"}
                    size={5.7}
                    data={[
                        { 
                            id: 0,
                            value: filteredUser().teachers.filter((teacher) =>
                                teacher.active).length,
                            label: 'Active',
                            color: theme === "light"
                            ? "#059669"
                            : "#34D399"
                        },
                        {
                            id: 1,
                            value: filteredUser().teachers.filter((teacher) =>
                                !teacher.active).length,
                            label: 'Blocked',
                            color: theme === "light"
                            ? "#E11D48"
                            : "#FB7185"
                        },
                    ]}
                />
                <HomeData
                    count={filteredUser().students.length}
                    label={filteredUser().students.length === 1
                    ? "Student"
                    : "Students"}
                    size={5.7}
                    data={[
                        {
                            id: 0,
                            value: filteredUser().students.filter((student) =>
                                student.active).length,
                            label: 'Active',
                            color: theme === "light"
                            ? "#059669"
                            : "#34D399"
                        },
                        {
                            id: 1,
                            value: filteredUser().students.filter((student) =>
                                !student.active).length,
                            label: 'Blocked',
                            color: theme === "light"
                            ? "#E11D48"
                            : "#FB7185"
                        },
                    ]} 
                />
                <HomeData
                    count={filteredUser().teachers.length}
                    label={filteredUser().teachers.length === 1
                    ? "Teacher Profile"
                    : "Teachers Profiles"}
                    size={5.7}
                    data={[
                        {
                            id: 0,
                            value: filteredUser().teachers.filter((teacher) =>
                                teacher.status === "Pending").length,
                            label: 'Pending',
                            color: theme === "light"
                            ? "#D97706"
                            : "#FBBF24"
                        },
                        {
                            id: 1,
                            value: filteredUser().teachers.filter((teacher) =>
                                teacher.status === "Approved").length,
                            label: 'Approved',
                            color: theme === "light"
                            ? "#059669"
                            : "#34D399"
                        },
                        {
                            id: 2,
                            value: filteredUser().teachers.filter((teacher) =>
                                teacher.status === "Rejected").length,
                            label: 'Rejected',
                            color: theme === "light"
                            ? "#E11D48"
                            : "#FB7185"
                        },
                    ]}
                />
            </Grid>
            <Grid item container md={12} sm={12} gap={2}>
                <HomeData
                    count={filteredUser().teachers.length}
                    label={filteredUser().teachers.length === 1
                    ? "Teacher Type"
                    : "Teachers Types"}
                    size={3.9}
                    data={[
                        {
                            id: 0,
                            value: filteredUser().teachers.filter((teacher) =>
                                teacher.due === "paid").length,
                            label: 'Paid',
                            color: theme === "light"
                            ? "#059669"
                            : "#34D399"
                        },
                        {
                            id: 1,
                            value: filteredUser().teachers.filter((teacher) =>
                                teacher.due === "volunteer").length,
                            label: 'Volunteer',
                            color: theme === "light"
                            ? "#D97706"
                            : "#FBBF24"
                        },
                    ]} 
                />
                <HomeData
                    count={Object.keys(recitations).length}
                    label={Object.keys(recitations).length === 1
                    ? "Recitation Evaluation"
                    : "Recitations Evaluations"}
                    size={3.9}
                    data={[
                        {
                            id: 0,
                            value: Object.values(recitations).filter((recitation) =>
                                recitation.status === "Pending").length,
                            label: 'Pending',
                            color: theme === "light"
                            ? "#D97706"
                            : "#FBBF24"
                        },
                        {
                            id: 1,
                            value: Object.values(recitations).filter((recitation) =>
                                recitation.status === "Accepted").length,
                            label: 'Accepted',
                            color: theme === "light"
                            ? "#059669"
                            : "#34D399"
                        },
                        {
                            id: 2,
                            value: Object.values(recitations).filter((recitation) =>
                                recitation.status === "Rejected").length,
                            label: 'Rejected',
                            color: theme === "light"
                            ? "#E11D48"
                            : "#FB7185"
                        },
                        {
                            id: 3,
                            value: Object.values(recitations).filter((recitation) =>
                                recitation.status === "Reported").length,
                            label: 'Reported',
                            color: theme === "light"
                            ? "#EA580C"
                            : "#FB923C"
                        },
                    ]}  
                />
            </Grid>
        </Grid>
    )
};

function mapStateToProps({users, recitations}) {
    return {
        users,
        recitations
    }
}

export default connect(mapStateToProps)(HomePage)