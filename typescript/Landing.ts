
const dataToSend = { name: 'value1', password: 'value2' };

fetch('https://lavida-server.vercel.app/api/check', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    //body: JSON.stringify(dataToSend),
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
