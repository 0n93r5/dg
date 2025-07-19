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

    // Fungsi setEpisode tanpa buka tab baru
    function setEpisode(episode, index) {
        // Hapus window.open supaya tidak membuka tab baru
        document.querySelectorAll(".episode-button").forEach(b => b.classList.remove("active"));
        episodeButtonsContainer.children[index].classList.add("active");

        videoPlayer.src = episode.url;
        episodeTitle.textContent = episode.title;
        currentEpisode = episode;

        iklanKe = 1;
        waktuIklanSelanjutnya = intervalIklan;

        videoPlayer.play();
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
            videoPlayer.pause();
            setTimeout(() => {
                adOverlay.style.display = "flex";
                adVideo.currentTime = 0;
                adVideo.play();
                lowerThird.style.display = "none"; // sembunyikan lowerThird saat iklan
            }, 100);

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

            iklanKe++;
            waktuIklanSelanjutnya = intervalIklan * iklanKe;
        }
    });

    adVideo.addEventListener("ended", () => {
        adOverlay.style.display = "none";
        videoPlayer.play();
        lowerThird.style.display = "block"; // tampilkan kembali lowerThird saat iklan selesai
    });

    // Event tombol close iklan (yang ada countdown)
    closeAdBtn.addEventListener("click", () => {
        if (closeAdBtn.disabled) {
            window.open("https://www.admto.online", "_blank");
        } else {
            adOverlay.style.display = "none";
            adVideo.pause();
            videoPlayer.play();
            lowerThird.style.display = "block"; // muncul lagi saat iklan ditutup manual
        }
    });

    adVideo.addEventListener("error", () => {
        adOverlay.style.display = "none";
        videoPlayer.play();
        lowerThird.style.display = "block";
    });

    // Tambahkan tombol close overlay di kanan atas
    let closeOverlayBtn = document.createElement("button");
    closeOverlayBtn.textContent = "X";
    closeOverlayBtn.style.position = "absolute";
    closeOverlayBtn.style.top = "10px";
    closeOverlayBtn.style.right = "10px";
    closeOverlayBtn.style.padding = "5px 10px";
    closeOverlayBtn.style.fontSize = "16px";
    closeOverlayBtn.style.cursor = "pointer";
    closeOverlayBtn.style.zIndex = "10001";
    adOverlay.appendChild(closeOverlayBtn);

    closeOverlayBtn.addEventListener("click", () => {
        adOverlay.style.display = "none";
        adVideo.pause();
        videoPlayer.play();
        lowerThird.style.display = "block";
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
