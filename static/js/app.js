const addVideoDownloadTaskPath = '//localhost:3000/api/add-video-download-task';
const getResultPath = '//localhost:3000/api/get-video-download-result?token=';

async function addVideoDownloadTask(url) {
    const response = await fetch(addVideoDownloadTaskPath, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({url}),
    });
    const {token} = await response.json();
    return token;
}

document.addEventListener("DOMContentLoaded", async () => {
    const sendButton = document.querySelector('#sendButton');
    const urlBox = document.querySelector('#urlBox');
    sendButton.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const url = urlBox.value;
        if (!url) {
            return;
        }
        const token = await addVideoDownloadTask(url);
        localStorage.setItem('token', token);
        sendButton.classList.add('disabled');
        await enableDownloadButton();
    });
    const token = localStorage.getItem('token');
    if (token) {
        sendButton.classList.add('disabled');
    }

    await enableDownloadButton();
});

async function enableDownloadButton() {
    const token = localStorage.getItem('token');
    const result = await waitingDownloading(token);
    if (result.downloadVideoUrl){
        const downloadButton = document.querySelector('#downloadButton');
        downloadButton.href = result.downloadVideoUrl;
        downloadButton.classList.remove('disabled');
    }
}

async function getResult(token) {
    const response = await fetch(getResultPath + token, {
        method: 'GET'
    });
    return await response.json();
}

function sleep(ms = 5000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

async function waitingDownloading(token) {
    let result;
    let status;
    while(status !== 'failed' && status !== 'completed') {
        result = await getResult(token);
        status = result.status;
        await sleep();
    }
    return result;
}

// (async () => {
//     await addVideoDownloadTask("https://www.youtube.com/watch?v=R31c6o05tBs");
// })();