document.addEventListener("DOMContentLoaded", function () {
    const videoPlayer = document.getElementById("videoPlayer");
    const adOverlay = document.getElementById("adOverlay");
    const adVideo = document.getElementById("adVideo");
    const closeAdBtn = document.getElementById("closeAdBtn");
    const episodeTitle = document.getElementById("episodeTitle");
    const episodeButtonsContainer = document.getElementById("episodeButtons");
    const downloadBtn = document.getElementById("downloadBtn");
    const manualDownloadPopup = document.getElementById("manualDownloadPopup");
    const manualDownloadLink = document.getElementById("manualDownloadLink");
    const lowerThird = document.getElementById("lowerThird");

    const adLinks = window.adLinks || [];
    const episodes = window.episodes || [];

    let currentEpisode = episodes[0];
    let iklanKe = 1;
    const intervalIklan = 600;
    let waktuIklanSelanjutnya = intervalIklan;

    function tampilkanIklan() {
        videoPlayer.pause();
        adOverlay.style.display = "flex";
        adVideo.currentTime = 0;
        adVideo.play();

        let countdown = 15;
        closeAdBtn.disabled = true;
        closeAdBtn.innerText = `Tutup Iklan (${countdown})`;

        const interval = setInterval(() => {
            countdown--;
            closeAdBtn.innerText = `Tutup Iklan (${countdown})`;
            if (countdown <= 0) {
                clearInterval(interval);
                closeAdBtn.disabled = false;
                closeAdBtn.innerText = "Tutup Iklan";
            }
        }, 1000);
    }

    function setEpisode(episode, index) {
        window.open(adLinks[Math.floor(Math.random() * adLinks.length)], "_blank");
        document.querySelectorAll(".episode-button").forEach(b => b.classList.remove("active"));
        episodeButtonsContainer.children[index].classList.add("active");

        videoPlayer.src = episode.url;
        episodeTitle.textContent = episode.title;
        currentEpisode = episode;

        iklanKe = 1;
        waktuIklanSelanjutnya = intervalIklan;

        videoPlayer.play();

        // Munculkan iklan saat ganti episode
        setTimeout(tampilkanIklan, 500);
    }

    if (currentEpisode) {
        videoPlayer.src = currentEpisode.url;
        episodeTitle.textContent = currentEpisode.title;
    }

    episodes.forEach((episode, index) => {
        const btn = document.createElement("button");
        btn.textContent = index + 1;
        btn.classList.add("episode-button");
        if (index === 0) btn.classList.add("active");

        btn.addEventListener("click", () => setEpisode(episode, index));
        episodeButtonsContainer.appendChild(btn);
    });

    videoPlayer.addEventListener("timeupdate", function () {
        if (videoPlayer.currentTime >= waktuIklanSelanjutnya) {
            tampilkanIklan();
            iklanKe++;
            waktuIklanSelanjutnya = intervalIklan * iklanKe;
        }
    });

    adVideo.addEventListener("play", () => {
        lowerThird.style.display = "none";
    });

    adVideo.addEventListener("ended", () => {
        adOverlay.style.display = "none";
        videoPlayer.play();
        lowerThird.style.display = "block";
    });

    closeAdBtn.addEventListener("click", () => {
        if (closeAdBtn.disabled) {
            window.open("https://www.admto.online", "_blank");
        } else {
            adOverlay.style.display = "none";
            adVideo.pause();
            videoPlayer.play();
            lowerThird.style.display = "block";
        }
    });

    adVideo.addEventListener("error", () => {
        adOverlay.style.display = "none";
        videoPlayer.play();
        lowerThird.style.display = "block";
    });

    videoPlayer.addEventListener("play", () => {
        if (adOverlay.style.display !== "flex") {
            lowerThird.style.display = "block";
        }
    });

    let clickCount = 0;
    downloadBtn.addEventListener("click", function (e) {
        e.preventDefault();
        clickCount++;
        if (clickCount < 3) {
            window.open(adLinks[Math.floor(Math.random() * adLinks.length)], "_blank");
        } else {
            if (currentEpisode && currentEpisode.url) {
                manualDownloadLink.value = currentEpisode.url;
                manualDownloadPopup.style.display = "block";
            } else {
                alert("Link download tidak tersedia.");
            }
            clickCount = 0;
        }
    });
});

function copyToClipboard() {
    const input = document.getElementById("manualDownloadLink");
    input.select();
    document.execCommand("copy");
    alert("Link telah disalin ke clipboard!");
}
