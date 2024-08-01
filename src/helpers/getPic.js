/* global gapi */

export default function readURL(input, img, getPic, style, saver, newPic) {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']
    if (input.files[0] !== undefined) {
        if (supportedTypes.includes(input.files[0].type)) {
        const reader = new FileReader();
        reader.onload = function (e) {
        img.attr('src', e.target.result)
            .width(100)
            .height(100);

        function handleDeleteFile(fileId) {
            let request = gapi.client.drive.files.delete({
                'fileId': fileId
            });
            request.execute((resp) => {
                console.log(resp)
            });
        }
        
        gapi.client.drive.files.create({
            'content-type': input.files[0].type,
            uploadType: 'resumable',
            name: input.files[0].name,
            mimeType: input.files[0].type,
            fields: 'id, name, kind, size',
            parents: ["1F5TfCPx_uB1zpExYgpDx5zua2MG1HUbP"]
        }).then(response => {
            handleDeleteFile(newPic.slice(29))
            saver(`https://lh3.google.com/u/0/d/${response.result.id}`);
            fetch(`https://www.googleapis.com/upload/drive/v3/files/${response.result.id}`, {
                method: 'PATCH',
                headers: new Headers({
                    'Authorization': `Bearer ${gapi.client.getToken().access_token}`,
                    'Content-Type': input.files[0].type
                }),
                body: input.files[0]
            }).then(res => console.log(res))
        })
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