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
