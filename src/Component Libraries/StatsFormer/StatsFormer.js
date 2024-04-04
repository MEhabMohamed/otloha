import { Grid, Typography } from "@mui/material";

export default function StatsFormer({ image , num, text}) {
    return (
        <Grid
            container
            textAlign="left"
            spacing={0}
            sx={{
                px: 1,
                py: '1px',
                maxWidth: 60
            }}>
            <Grid item xs={6} sm={6} md={6}>
                <img 
                src={image}
                alt={text}
                style={{
                    width: '18px',
                    height: '18px',
                }}
                />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
                <Typography variant="caption" fontWeight="bolder">
                {num}
                </Typography>
            </Grid>
            <Grid item md={12}>
                <Typography variant='caption' fontWeight="bolder">
                {text}
                </Typography>
            </Grid>
        </Grid>
    )
}