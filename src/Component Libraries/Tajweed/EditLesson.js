import { Button, Container, Grid, TextField } from '@mui/material';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { handleEditLesson } from '../../actions/tajweed';

function EditLesson({id}) {

    let lessons = JSON.parse(localStorage.getItem('tajweed')) !== null ?
    JSON.parse(localStorage.getItem('tajweed')).lessons : {}

    let [newTitle, setNewTitle] = useState(lessons[id].title);
    let [newContent, setNewContent] = useState(lessons[id].content);
    let [newLevel, setNewLevel] = useState(lessons[id].level);
    let [newParentLesson, setNewParentLesson] = useState(lessons[id].parentLesson);

    const handleChangeLevel = (event) => {
        setNewLevel(event.target.value);
    };

    const handleChangeLesson = (event) => {
        setNewParentLesson(event.target.value);
    };

    let levels = JSON.parse(localStorage.getItem('tajweed')) !== null ?
    JSON.parse(localStorage.getItem('tajweed')).levels : {}

    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <Container
            sx={{
                pt: 12,
                px: 1,
            }}
        >
            <Grid
                item
                mb={1}
            >
                <TextField
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="title"
                    defaultValue={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
            </Grid>
            <Grid
                item
                mb={1}
                container
            >
                <TextField
                    required
                    fullWidth
                    id="content"
                    label="Content"
                    name="content"
                    autoComplete="content"
                    defaultValue={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    multiline
                    rows={5}
                />
            </Grid>
            <Grid
                item
                mb={1}
            >
                <Box sx={{ minWidth: 120 }}>
                    <FormControl
                        fullWidth
                        required
                        >
                        <InputLabel id={`level-select-label`}>Tajweed Level</InputLabel>
                        <Select
                        labelId={`level-select-label`}
                        id={`level-select`}
                        value={newLevel}
                        label="Tajweed Level"
                        onChange={handleChangeLevel}
                        >
                        {Object.values(levels).map(({name}) => 
                        <MenuItem key={name} value={name}>{name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
            </Grid>
            <Grid
                item
                mb={1}
            >
                <Box sx={{ minWidth: 120 }}>
                    <FormControl
                        fullWidth
                        required
                        >
                        <InputLabel id={`level-select-label`}>Parent Lesson</InputLabel>
                        <Select
                        labelId={`parent-lesson-select-label`}
                        id={`parent-lesson-select`}
                        value={newParentLesson}
                        label="Tajweed Level"
                        onChange={handleChangeLesson}
                        >
                        {Object.values(lessons)
                        .filter(({title}) => title !== lessons[id].title)
                        .map(({title}) => 
                        <MenuItem key={title} value={title}>{title}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
            </Grid>
            <Grid
                textAlign="right"
            >
                <Button
                    sx={{
                        color: 'red'
                    }}
                    onClick={() => navigate('../tajweed/lessons')}
                >
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        dispatch(handleEditLesson(newTitle, newContent, newLevel, newParentLesson))
                        navigate('../tajweed/lessons')
                    }}
                >
                    Save
                </Button>
            </Grid>
        </Container>
    )
}

export default connect()(EditLesson)