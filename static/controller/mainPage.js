const apiAuth = "563492ad6f91700001000001c08b1dc33dd44cb6a722ea328554b1f0";
const next = document.querySelector(".next");
const input = document.querySelector("input");
const searchbutton = document.querySelector(".searchbutton");
let pageNumber = 1;
let search = false;
let query = "";

$(function(){
    $("#header").load("header.html"); 
});

function permission() {
    const jwtToken = localStorage.getItem('token');
    if(!jwtToken) document.body.innerHTML = 'YOU DO NOT HAVE ACCESS';
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

async function curatedPhotos(pageNumber) {
    const data = await fetch(`https://api.pexels.com/v1/curated?per_page=15&page=${pageNumber}`, {
        method:"GET",
        headers: {
            Accept: "application/json",
            Authorization: apiAuth,
        } 
    });
    const result = await data.json();
    result.photos.forEach((photo) => {
        const pic = document.createElement("div");
        pic.className = "image-box";
        pic.innerHTML = `<img src=${photo.src.large} class="photo"> <input value="${photo.src.large}" name="checkbox" class="checkbox" type="checkbox" checked>`;
        document.querySelector(".gallery").appendChild(pic);
    });
};

async function searchPhotos(query, pageNumber) {
    const data = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=15&page=${pageNumber}`, {
        method:"GET",
        headers: {
            Accept: "application/json",
            Authorization: apiAuth,
        } 
    });
    const result = await data.json();
    result.photos.forEach((photo) => {
        const pic = document.createElement("div");
        pic.innerHTML = `<img src=${photo.src.large} class="photo"> <input value="${photo.src.large}" name="checkbox" class="checkbox" type="checkbox" checked>`;
        document.querySelector(".gallery").appendChild(pic);
    });
};

function clear() {
    input.value = "";
    document.querySelector(".gallery").innerHTML = "";
    pageNumber = 1;
}


input.addEventListener('input', searchKeyWordInput)

function searchKeyWordInput(event) {
    event.preventDefault();
    query = event.target.value;
};

searchbutton.addEventListener('click', searchForKeyWord)

function searchForKeyWord() {
    if(input.value === "") return;
    clear();
    search = true;
    searchPhotos(query, pageNumber);
    pageNumber++;
};


next.addEventListener('click', loadNextImages)

function loadNextImages() {
    if (!search) {
        pageNumber++;
        curatedPhotos(pageNumber);
    } else {
        if(query.value === "") return;
        pageNumber++;
        searchPhotos(query, pageNumber);
    }
};


homeButton = document.getElementById("home-button");
homeButton.addEventListener('click', homePage);

function homePage() {
    location.reload();
};

async function downloadImages() {
    const photos = document.getElementsByClassName("photo");
    let uncheckedBoxes = document.querySelectorAll('input[name=checkbox]:not(:checked)');
    let photosUrl = [];
    const uncheckedPhotosUrl = [];
    const jwtToken = localStorage.getItem('token');

    
    for (let photo of photos) {
        photosUrl.push(photo.src);
    };
    for (let checkbox of uncheckedBoxes) {
        uncheckedPhotosUrl.push(checkbox.previousSibling.previousSibling.src);
    };
    photosUrl = photosUrl.filter(val => !uncheckedPhotosUrl.includes(val));
    
    await fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photosUrl, jwtToken })
    }).then((res) => res.json())
};

function unCheckAll() {
    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
}

const adminButton = document.getElementById("admin-button");
adminButton.addEventListener('click', adminPanel);

function adminPanel() {
    const jwtToken = localStorage.getItem('token');
    if (parseJwt(jwtToken).username === "admin@admin") {
        window.location.href = "/admin-dashboard.html";
    } else {
        alert("You do not have permission");
    }
};

function logout() {
    localStorage.removeItem('token');
};


curatedPhotos(pageNumber);
