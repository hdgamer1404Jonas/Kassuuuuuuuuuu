const gallery = document.getElementById('gallery');

const apilink = 'https://nekos.life/api/v2/img/neko';

function addGalleryItem() {
    const imageLink = fetch(apilink)
        .then(response => response.json())
        .then(data => data.url);

    const image = document.createElement('img');
    image.className = 'gallery-item';
    image.src = imageLink;
    image.addEventListener('click', onImageClick);
    gallery.appendChild(image);
}

function onImageClick(event) {
    const src = event.target.src;
    // remove the image from the gallery
    event.target.remove();
}

setInterval(addGalleryItem, 1000);