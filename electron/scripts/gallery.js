const gallery = document.getElementById('gallery');

const ipcRenderer = require('electron').ipcRenderer;

const apilink = 'https://nekos.life/api/v2/img/neko';

async function addGalleryItem() {
    const imageLink = await fetch(apilink)
        .then(response => response.json())
        .then(data => data.url);
    console.log(imageLink);
    const image = document.createElement('img');
    image.src = imageLink;
    image.addEventListener('click', onImageClick);
    image.style.width = '200px';
    image.style.height = '200px';
    image.style.objectFit = 'cover';
    image.style.borderRadius = '10px';
    image.style.margin = '10px';
    gallery.appendChild(image);
}

function onImageClick(event) {
    const src = event.target.src;
    // download the image to the downloads folder
    ipcRenderer.send('download', {
        url: src
    });
}


for (let i = 0; i < 7; i++) {
    addGalleryItem();
}

// add an scroll event listener to the gallery
document.addEventListener('scroll', () => {
    // if the user has scrolled to the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // add another image to the gallery
        addGalleryItem();
        addGalleryItem();
        // move up the page by 20px
        window.scrollBy(0, -20);
    }
});