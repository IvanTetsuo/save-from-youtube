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
    urlBox.value = localStorage.getItem('url') || '';
    sendButton.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const url = urlBox.value;
        if (!url) {
            return;
        }
        const token = await addVideoDownloadTask(url);
        localStorage.setItem('token', token);
        localStorage.setItem('url', url);
        urlBox.disabled = 'disabled';

        sendButton.classList.add('disabled');
        await enableDownloadButton();
    });
    const token = localStorage.getItem('token');
    if (token) {
        sendButton.classList.add('disabled');
    }
    await enableDownloadButton();
    
    const clearButton = document.querySelector('#clearButton');
    clearButton.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        clear();
    });
});

function clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('url');
    document.querySelector('#urlBox').value = '';
    document.querySelector('#urlBox').disabled = undefined;
    document.querySelector('#downloadButton').classList.add('disabled');
    document.querySelector('#sendButton').classList.remove('disabled');
}

async function enableDownloadButton() {
    try {
        const token = localStorage.getItem('token');
        const result = await waitingDownloading(token);
        if (result.downloadVideoUrl){
            const downloadButton = document.querySelector('#downloadButton');
            downloadButton.href = result.downloadVideoUrl;
            downloadButton.classList.remove('disabled');
        }
    } catch(err) {
        clear();
        console.log(err);
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
    if (!token) {
        throw new Error('Попытка отправить пустой токен');
    }
    let result;
    let status;
    while(status !== 'failed' && status !== 'completed') {
        result = await getResult(token);
        if (result.error) {
            throw new Error('Видео не найдено');
        }
        console.log(result);
        status = result.status;
        if (status !== 'failed' && status !== 'completed') {
            await sleep();
        }
    }
    return result;
}