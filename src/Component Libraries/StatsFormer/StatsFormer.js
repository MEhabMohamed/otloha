import { Grid, Typography } from "@mui/material";

export default function StatsFormer({ image , num, text}) {
    return (
        <Grid container textAlign="left" spacing={0} py={1} pl={2} maxWidth={60}>
            <Grid item xs={12} sm={12} md={10}>
                <img 
                src={image}
                alt={text}
                style={{
                    width: '25px',
                    height: '25px',
                }}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={2}>
                <Typography variant="body2" fontWeight="bolder">
                {num}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant='body2' fontWeight="bolder">
                {text}
                </Typography>
            </Grid>
        </Grid>
    )
}