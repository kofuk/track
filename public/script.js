const updateParams = (queryType, query) => {
    const searchParams = new URLSearchParams();
    searchParams.append(queryType, query);
    history.replaceState(null, null, '?' + searchParams.toString());
};

const doSearchByUUID = (query) => {
    const container = document.querySelector('.container');
    container.innerText = 'Loading…';

    const params = new URLSearchParams();
    params.append('q', query);

    fetch('/byuuid?' + params.toString())
        .then((resp) => resp.json())
        .then((items) => {
            if (items.length === 0) {
                container.innerHTML = 'Box is empty or not found.';
                return;
            }

            container.innerHTML = '';

            const title = document.createElement('h2');
            title.innerText = `Items in ${query}`;
            container.appendChild(title);

            const list = document.createElement('ul');
            container.appendChild(list);

            for (const item of items) {
                const li = document.createElement('li');
                li.innerText = item;

                list.appendChild(li);
            }
        });
};



const initByUUID = () => {
    const uuid_form = document.getElementById('byuuid');
    uuid_form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const query = document.getElementById('input-uuid').value;

        updateParams('byuuid', query);

        doSearchByUUID(query);
    });

    let useCamera = false;

    document.getElementById('qr').addEventListener('click', (event) => {
        useCamera = !useCamera;
        if (!useCamera) {
            return;
        }

        const video = document.createElement('video');
        video.style.position = 'absolute';
        video.style.top = 0;
        video.style.left = 0;
        video.style.width = '100%';
        document.body.appendChild(video);

        const canvas = document.createElement('canvas');

        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then((strm) => {
                video.srcObject = strm;
                video.setAttribute('playsinline', true);
                video.play();

                const processFrame = () => {
                    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
                        requestAnimationFrame(processFrame);
                        return;
                    }

                    const width = video.videoWidth;
                    const height = video.videoHeight;
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, width, height);
                    const image = ctx.getImageData(0, 0, width, height);
                    const code = jsQR(image.data, width, height, {
                        inversionAttempts: 'dontInvert'
                    });

                    if (code) {
                        const id = code.data;
                        if (id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
                            doSearchByUUID(id);
                            useCamera = false;
                        }
                    }

                    if (!useCamera) {
                        video.remove();
                        for (const track of strm.getTracks()) {
                            track.stop();
                        }
                        return;
                    }

                    requestAnimationFrame(processFrame);
                };

                requestAnimationFrame(processFrame);
            });
    });
};

const doSearchByType = (query) => {
    const container = document.querySelector('.container');
    container.innerText = 'Loading…';

    const params = new URLSearchParams();
    params.append('q', query);

    fetch('/bytype?' + params.toString())
        .then((resp) => resp.json())
        .then((items) => {
            container.innerHTML = '';

            const title = document.createElement('h2');
            title.innerText = `Items in ${query}`;
            container.appendChild(title);

            const list = document.createElement('ul');
            container.appendChild(list);

            for (const item of items) {
                const li = document.createElement('li');
                li.innerText = item;

                list.appendChild(li);
            }
        });
};

const initByType = () => {
    const uuid_form = document.getElementById('bytype');
    uuid_form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const container = document.querySelector('.container');
        container.innerText = 'Loading…';

        const query = document.getElementById('input-type').value;

        updateParams('bytype', query);

        doSearchByType(query);
    });
};

const doSearchByKeyword = (query) => {
    const container = document.querySelector('.container');
    container.innerText = 'Loading…';

    const params = new URLSearchParams();
    params.append('q', query);

    fetch('/byitem?' + params.toString())
        .then((resp) => resp.json())
        .then((items) => {
            container.innerHTML = '';

            const title = document.createElement('h2');
            title.innerText = `Items matching “${query}”`;
            container.appendChild(title);

            const list = document.createElement('ul');
            container.appendChild(list);

            for (const box of items) {
                const li = document.createElement('li');
                li.innerText = box['id'];

                const innerList = document.createElement('ul');
                for (const item of box['matching_items']) {
                    const li = document.createElement('li');
                    li.innerText = item;
                    innerList.appendChild(li);
                }
                li.appendChild(innerList);
                list.appendChild(li);
            }
        });
};

const initByKeyword = () => {
    const uuid_form = document.getElementById('byitem');
    uuid_form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const query = document.getElementById('input-item').value;

        updateParams('bykeyword', query);

        doSearchByKeyword(query);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initByUUID();
    initByType();
    initByKeyword();

    const params = (new URL(location.href)).searchParams;
    if (params.has('byuuid')) {
        doSearchByUUID(params.get('byuuid'));
    } else if (params.has('bytype')) {
        doSearchByType(params.get('bytype'));
    } else if (params.has('bykeyword')) {
        doSearchByKeyword(params.get('bykeyword'));
    }
});
