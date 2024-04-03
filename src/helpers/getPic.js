export default function readURL(input, img, getPic, style) {
    if (input.files && input.files[0] && input.files[0].name.slice(-4) === ('.jpg' || 'jpeg' || '.png')) {
        const reader = new FileReader();
        reader.onload = function (e) {
        img.attr('src', e.target.result)
            .width(100)
            .height(100);
        };
        reader.readAsDataURL(input.files[0]);
        img.show();
        getPic.css(style);
    } 
}