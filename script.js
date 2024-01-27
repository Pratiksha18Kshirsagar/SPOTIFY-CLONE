let currentSong = new Audio();
console.log(currentSong);

console.log("lets write some javascript!!")


function secondsToMinutes(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = (seconds % 60).toFixed(0);

    // Format the result as "00:00"
    var formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
    var formattedSeconds = (remainingSeconds < 10) ? '0' + remainingSeconds : remainingSeconds;

    return formattedMinutes + ':' + formattedSeconds;
}

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

function playMusic(track, pause = false) {
    // let audio = new Audio("/songs!!/" + track);
    currentSong.src = "/songs!!/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00";
}

async function main() {

    //list the songs

    let song = await getSongs();
    playMusic(song[0], true)
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
            console.log(currentSong.paused);
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            console.log(currentSong.paused);
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    //listen for time update event!!
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    //add a event listener to the seekbar
    document.querySelector(".seekBar").addEventListener("click", (e) => {
        // console.log(e.target.getBoundingClientRect())
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })


    //Add a event listner to hamburger class!!
    document.querySelector(".hamburgerCont").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

}

main();