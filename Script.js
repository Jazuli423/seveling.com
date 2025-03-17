document.getElementById("search-btn").addEventListener("click", async () => {
    const songInput = document.getElementById("song-input").value.trim();
    const songDetails = document.getElementById("song-details");

    if (!songInput) {
        songDetails.innerHTML = "⚠️ Harap masukkan judul lagu.";
        return;
    }

    songDetails.innerHTML = "⏳ Sedang mencari lagu...";

    try {
        const searchApiUrl = `https://spotifyapi.caliphdev.com/api/search/tracks?q=${encodeURIComponent(songInput)}`;
        const searchResponse = await fetch(searchApiUrl);
        const searchData = await searchResponse.json();

        if (!searchData[0]) {
            songDetails.innerHTML = "❌ Lagu tidak ditemukan.";
            return;
        }

        const data = searchData[0];
        const downloadUrl = `https://spotifyapi.caliphdev.com/api/download/track?url=${encodeURIComponent(data.url)}`;

        songDetails.innerHTML = `
            <p><strong>Judul:</strong> ${data.title}</p>
            <p><strong>Artis:</strong> ${data.artist}</p>
            <p><strong>URL:</strong> <a href="${data.url}" target="_blank">Klik di sini</a></p>
            <img src="${data.thumbnail}" alt="Thumbnail" style="width:100%; border-radius:5px; margin-top:10px;" />
            <a href="${downloadUrl}" id="download-btn" target="_blank" style="display:block; margin-top:10px; padding:10px; background-color:#ff5733; color:white; text-align:center; border-radius:5px; text-decoration:none;">
                🔽 Download Lagu
            </a>
        `;
    } catch (error) {
        console.error(error);
        songDetails.innerHTML = "❌ Terjadi kesalahan saat memproses permintaan.";
    }
});
