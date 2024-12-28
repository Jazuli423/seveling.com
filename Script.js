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

        songDetails.innerHTML = `
            <p><strong>Judul:</strong> ${data.title}</p>
            <p><strong>Artis:</strong> ${data.artist}</p>
            <p><strong>URL:</strong> <a href="${data.url}" target="_blank">Klik di sini</a></p>
            <img src="${data.thumbnail}" alt="Thumbnail" style="width:100%; border-radius:5px; margin-top:10px;" />
            <button id="download-btn" data-url="${data.url}" style="margin-top: 10px;">Download Lagu</button>
        `;

        document.getElementById("download-btn").addEventListener("click", async (event) => {
            const downloadUrl = `https://spotifyapi.caliphdev.com/api/download/track?url=${encodeURIComponent(event.target.getAttribute("data-url"))}`;
            
            songDetails.innerHTML += "<p>⏳ Sedang mengunduh...</p>";

            try {
                const downloadResponse = await fetch(downloadUrl);

                if (downloadResponse.ok && downloadResponse.headers.get("content-type").includes("audio/mpeg")) {
                    const audioBlob = await downloadResponse.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    const downloadLink = document.createElement("a");
                    downloadLink.href = audioUrl;
                    downloadLink.download = `${data.title}.mp3`;
                    downloadLink.click();
                    
                    songDetails.innerHTML += "<p>✅ Lagu berhasil diunduh!</p>";
                } else {
                    alert("❌ Gagal mengunduh file audio. File tidak ditemukan.");
                }
            } catch (error) {
                console.error(error);
                alert("❌ Terjadi kesalahan saat mengunduh lagu.");
            }
        });
    } catch (error) {
        console.error(error);
        songDetails.innerHTML = "❌ Terjadi kesalahan saat memproses permintaan.";
    }
});