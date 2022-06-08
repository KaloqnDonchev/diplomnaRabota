fetch('/visualize', {
    method:"GET",
    headers: {
        Accept: "application/json"
    } 
})
.then(response => response.json())
.then((images) => {
    const gallery = document.querySelector(".gallery");
    for (let image of images.data) {
        const imageDiv = document.createElement("div");
        imageDiv.innerHTML = `<img src=${image.imageSource}">`;
        gallery.appendChild(imageDiv);
    }
    if (gallery.childNodes.length === 0) gallery.innerHTML = '<h1> You have no downloaded images </h1>';
})


function permission() {
    const jwtToken = localStorage.getItem('token');
    if(!jwtToken) document.body.innerHTML = 'YOU DO NOT HAVE ACCESS';
}