import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleAddLevel } from '../../actions/tajweed';

function AddLevel() {

    let [newName, setNewName] = useState('');
    let [newColor, setNewColor] = useState('');
    let [newValue, setNewValue] = useState('');

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
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    onChange={(e) => setNewName(e.target.value)}
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
                        dispatch(handleAddLevel(newName, newColor, newValue))
                        navigate('../tajweed/levels')
                    }}
                >
                    Save
                </Button>
            </Grid>
        </Container>
    )
}

export default connect()(AddLevel)