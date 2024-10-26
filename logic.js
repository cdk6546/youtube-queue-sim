

let config;
let current_queue = [];
let API_KEY;
let player;

fetch('config.json')
    .then(response => response.json())
    .then(data => {
        config = data;
        API_KEY = config.API_KEY;
        init(); 
    })
    .catch(error => console.error('Error loading config:', error));

function init() {
    gapi.load('client', () => {
        console.log("GAPI client loaded");
        gapi.client.load('youtube', 'v3', () => {
            console.log("YouTube API loaded")
            searchVisible();
            initEmbed();
        });
    });
}

function initEmbed() {
    player = new YT.Player('player', {
        height: '400',
        width: '400',
        videoId: '', 
    });
}


function getElapsedTime() {
    if (player) {
        return player.getCurrentTime();
    }
}

function searchVisible(){
    document.getElementsByClassName("loading")[0].style.display = "none";
    document.getElementsByClassName("main")[0].style.display = "block";
}

function searchYouTube(query) {
    const request = gapi.client.youtube.search.list({
        part: 'snippet',
        q: query,
        type: 'video',
        key: API_KEY
    });

    document.getElementById('search-container').style.display = "";


    request.execute(function(response) {
        const results = response.result.items;
        $('#search-container').empty(); 
        if (results.length > 0) {
            results.forEach(item => {
                const videoId = item.id.videoId;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`; 

                $('#search-container').append(`<div>
                    <a href=${videoUrl}><h3>${item.snippet.title}</h3></a>
                    <div class="content-row">
                    <div class="content-image">
                    <img src="${item.snippet.thumbnails.default.url}" alt="${item.snippet.title}">
                    </div>
                    <button id="addQueue" onclick="queue('${item.id.videoId}', '${item.snippet.title}')">Queue</button>
                    <button id="playButton" onclick="playNow('${item.id.videoId}')">Play Now</button>
                    </div>
                </div>`);
            });
            $('#search-container').append(`<button id="closeSearch" onclick="closeSearch()">Close Search Results</button>`)
        } else {
            $('#search-container').append('<p>No results found.</p>');
        }
    });
}

function closeSearch(){
    document.getElementById('search-container').style.display = "none";
}
function queue(videoId, videoTitle){
    current_queue.push([videoId, videoTitle]);
    console.log(current_queue);
    updateQueueDisplay(videoTitle);
}

function remove(videoId){
    let newArr = current_queue.filter(item => item[0] !== videoId);
    current_queue = newArr;
    updateQueueDisplay();
}

function updateQueueDisplay(videoTitle) {
    const queueList = $('#queue-list');
    queueList.empty();
    current_queue.forEach(element => {
        const videoUrl = `https://www.youtube.com/watch?v=${element[0]}`;
        queueList.append(`<li>
            <a href="${videoUrl}" target="_blank">${element[1]}</a> | Queued By: User
            <br/>
            <button onclick="remove('${element[0]}')">Remove</button>
        </li>`);
    });
}

function playNow(videoId){
    if (player){
        player.loadVideoById(videoId);
    }
}

function play(){
    const videoIds = current_queue.map(item => item[0]);
    const state = player.getPlayerState();

    console.log(state);

    if (player) {
        if (state == 1 || state == 2) {
            const time = getElapsedTime();
            console.log(time);
            player.cuePlaylist(videoIds);
            player.seekTo(time);
        }

        else{
            player.cuePlaylist(videoIds);
        }
    
    }
}

$(document).ready(function() {
    $('#search-button').click(function() {
        const query = $('#search-query').val();
        if (query) {
            searchYouTube(query);
        }
    });
});
