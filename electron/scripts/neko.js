const apiLink = 'https://nekos.life/api/v2/img/neko';

const main = document.getElementById('main');

const download = async () => {
    // Get the data from the API and set it as the background image
    const data = await fetch(apiLink);
    const json = await data.json();
    const url = json.url;
    main.style.backgroundImage = `url(${url})`;
    main.style.backgroundSize = 'cover';
}

setInterval(download, 5000);
download();