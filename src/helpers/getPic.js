export default function readURL(input, img, getPic, style, saver) {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']
    if (input.files[0] !== undefined) {
        if (supportedTypes.includes(input.files[0].type)) {
        const reader = new FileReader();
        reader.onload = function (e) {
        img.attr('src', e.target.result)
            .width(100)
            .height(100);
        saver(e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
        img.show();
        getPic.css(style);
        } else {
            img.hide();
            getPic.css({
                width: '100px',
                height: '100px',
                position: 'relative',
                margin: 'auto'
            })
        }
    }
}