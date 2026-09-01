import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { handleEditLevel } from '../../actions/tajweed';

function EditLevel({ id: propId, levels }) {
    const { id: paramId } = useParams();
    const id = propId || paramId;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    let [newName, setNewName] = useState(levels[id]?.name || '');
    let [newColor, setNewColor] = useState(levels[id]?.color || '#000000');
    let [newValue, setNewValue] = useState(levels[id]?.value || '');

    if (!levels[id]) {
        return (
            <Container sx={{ pt: 12, px: 1 }}>
                <Typography>Loading level...</Typography>
            </Container>
        );
    }

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
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    onChange={(e) => setNewName(e.target.value)}
                    defaultValue={levels[id].name}
                />
            </Grid>
            <Grid
                item
                mb={1}
                container
            >
                 <Typography
                    sx={{
                        mr: 1
                    }}
                >
                    Color
                </Typography>
                <input
                    type='color'
                    onChange={(e) => setNewColor(e.target.value)}
                    style={{
                        border: 'transparent',
                        height: '20px'
                    }}
                    defaultValue={levels[id].color}
                />
            </Grid>
            <Grid
                item
                mb={1}
            >
                <TextField
                    required
                    fullWidth
                    id="value"
                    label="Value"
                    name="value"
                    autoComplete="value"
                    onChange={(e) => setNewValue(e.target.value)}
                    defaultValue={levels[id].value}
                />
            </Grid>
            <Grid
                textAlign="right"
            >
                <Button
                    sx={{
                        color: 'red'
                    }}
                    onClick={() => navigate('../tajweed/levels')}
                >
                    Cancel
                </Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        dispatch(handleEditLevel(id, newName, newColor, newValue))
                        navigate('../tajweed/levels')
                    }}
                >
                    Save
                </Button>
            </Grid>
        </Container>
    )
}

function mapStateToProps({ tajweed }) {
    return {
        levels: tajweed !== null ? tajweed.levels : {},
    }
}

export default connect(mapStateToProps)(EditLevel)