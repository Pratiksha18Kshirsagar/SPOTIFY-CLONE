let currentSong = new Audio();
console.log(currentSong);





console.log("lets write some javascript!!")

async function getSongs() {
    let a = await fetch('http://127.0.0.1:3000/songs!!/');
    let response = await a.text();
    console.log(response)




    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = [];
    console.log(as);
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs!!/")[1])
        }


    }
    console.log(songs);
    return songs;
}

function playMusic(track) {
    // let audio = new Audio("/songs!!/" + track);
    currentSong.src = "/songs!!/" + track;
    currentSong.play();
}

async function main() {

    //list the songs

    let song = await getSongs();
    console.log(song);


    let songUl = document.querySelector(".songList").getElementsByTagName('ul')[0];
    for (const s of song) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="./music.svg" alt="">
    <div class="songInfo">
        <div>${s.replaceAll("%20", " ")}</div>
        <div>Pratiksha.</div>
    </div>
    <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="./play.svg" alt="">
    </div>
    </li>`;

    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML);
        })

    })


    //Attach a addEvent Listener to play , next and previous !!
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
        }
        else {
            currentSong.pause();
        }
    })



}

main();