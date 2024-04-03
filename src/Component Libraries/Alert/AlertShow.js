export default function AlertShow(alert, reset, resetText) {
    reset(resetText);
    alert.show();
    return setTimeout(() => {
        alert.hide();
        reset('');
    }, 3000)
} 