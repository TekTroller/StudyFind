const StorageClient = require('../storageClient');

const client = new StorageClient();

/* Upload data

client.set_patient("0xD6bDcFf2d8078fc946Efb07f6Be4D60D2b74dBeF").then(() => {
    client.upload("file2", "file data");
});
*/


/* Retrieve data

client.set_patient("0xD6bDcFf2d8078fc946Efb07f6Be4D60D2b74dBeF").then(() => {
    client.view("file2").then((data) => {
        console.log(data);
    });
});
*/

