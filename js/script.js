

let songUl;
let songs;
let currentSong = new Audio();
let currFolder;
// console.log(currentSong);

// console.log("lets write some javascript!!")


function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return '00:00';
    }
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = (seconds % 60).toFixed(0);

    // Format the result as "00:00"
    var formattedMinutes = (minutes < 10) ? '0' + minutes : minutes;
    var formattedSeconds = (remainingSeconds < 10) ? '0' + remainingSeconds : remainingSeconds;

    return formattedMinutes + ':' + formattedSeconds;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${currFolder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    // console.log(as);
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }
    }
    console.log(songs);
    songUl = document.querySelector(".songList").getElementsByTagName('ul')[0];
    songUl.innerHTML = " ";
    for (const s of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="./img/music.svg" alt="">
        <div class="songInfo">
             <div>${s.replaceAll("%20", " ")}</div>
            <div>Pratiksha.</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class="invert" src="./img/play.svg" alt="">
        </div>
        </li>`;

    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML);
        })

    })
    return songs;
}



function playMusic(track, pause = false) {
    // let audio = new Audio("/songs!!/" + track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "./img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}


async function displayAlbums() {

    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
    if (e.href.includes("/songs")) {
        let folder = (e.href.split("/").slice(-2)[0]);
        //get the meta data of the folder
        let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
        let response = await a.json();
        cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
            <div  class="play">
                <img src="./img/playbut.svg" alt="">

            </div>
            <img src="/songs/${folder}/cover.jpg">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
    }


    }

Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
        // console.log(item , item.currentTarget.dataset);
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0]);
    })
 
});

}



async function main() {

    //list the songs

    await getSongs("songs/ncs");

    playMusic(songs[0], true)


    //Display all the albums on the page
    displayAlbums();



    //Attach a addEvent Listener to play , next and previous !!
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            // console.log(currentSong.paused);
            currentSong.play();
            play.src = "./img/pause.svg";
        }
        else {
            // console.log(currentSong.paused);
            currentSong.pause();
            play.src = "./img/play.svg";
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


    //Add a event listner to close class!!
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-230%";
    })

    //previous and next button 
    previous.addEventListener("click", () => {
        // console.log(currentSong);

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }

    })

    next.addEventListener("click", () => {
        // console.log(next);

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(index);

        if ((index + 1) < songs.length) {
            // console.log(length);
            playMusic(songs[index + 1]);
        }

        // console.log(currentSong.src);
        // console.log(currentSong.src.split("/"));
        // console.log(currentSong.src.split("/").slice(-1)[0])



    })

    //Add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e);
        // console.log(e.target);
        // console.log(e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg" , "volume.svg")
        }
        
    })

//add event listner to volume to mute 
document.querySelector(".volume>img").addEventListener("click" ,e =>{
   
    if(e.target.src.includes("volume.svg")){
    e.target.src =  e.target.src.replace("volume.svg" , "mute.svg");
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0 ;
    }
    else{
        
       e.target.src=  e.target.src.replace("mute.svg" , "volume.svg");
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10 ;
    }
})

}


main();