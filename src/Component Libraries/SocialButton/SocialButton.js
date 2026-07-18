import Button from '@mui/material/Button';

export default function SocialButton({ source , alternate , text, onClick}) {
    return (
        <Button 
        color="primary"
        variant="outlined"
        onClick={onClick}
        sx={{
            ":hover": {
                color: 'black'
            }
        }}
        >
            <img 
            src={source} 
            alt={alternate}
            style={{
            width: "2rem",
            height: "2rem"
            }}
            />
            &nbsp; Using {text}
        </Button>
    )
}