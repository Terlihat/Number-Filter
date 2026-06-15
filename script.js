// Versi Code: v1.2.0

document.addEventListener("DOMContentLoaded", () => {
    const btnProcess = document.getElementById("processBtn");
    const btnCopy = document.getElementById("copyBtn");
    const btnDownload = document.getElementById("downloadBtn");
    
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const output = document.getElementById("output");
    const stats = document.getElementById("stats");

    // Fungsi untuk menyimpan data ke LocalStorage (Auto Save)
    const autoSave = () => {
        localStorage.setItem("nft_input1", input1.innerHTML);
        localStorage.setItem("nft_input2", input2.value);
        localStorage.setItem("nft_output", output.value);
        localStorage.setItem("nft_stats", stats.innerHTML);
    };

    // Fungsi untuk memuat data dari LocalStorage saat halaman dibuka/refresh
    const loadSavedData = () => {
        const savedInput1 = localStorage.getItem("nft_input1");
        const savedInput2 = localStorage.getItem("nft_input2");
        const savedOutput = localStorage.getItem("nft_output");
        const savedStats = localStorage.getItem("nft_stats");

        if (savedInput1) input1.innerHTML = savedInput1;
        if (savedInput2) input2.value = savedInput2;
        if (savedOutput) output.value = savedOutput;
        if (savedStats) stats.innerHTML = savedStats;
    };

    // Jalankan fungsi load data di awal
    loadSavedData();

    // Event listener untuk auto-save saat mendeteksi ketikan baru sebelum diproses
    input1.addEventListener("input", autoSave);
    input2.addEventListener("input", autoSave);

    // Logika Pencocokan Data
    btnProcess.addEventListener("click", () => {
        const rawData1 = input1.innerText;
        const rawData2 = input2.value;

        const array1 = rawData1.split('\n')
            .map(line => line.trim())
            .filter(line => line !== "");
            
        const array2 = rawData2.split('\n')
            .map(line => line.trim())
            .filter(line => line !== "");

        const set2 = new Set(array2);
        
        let markedHTML = "";
        let resultArray = [];

        array1.forEach((item) => {
            if (set2.has(item)) {
                markedHTML += `<div class="match-red">${item}</div>`;
            } else {
                markedHTML += `<div class="nomatch-green">${item}</div>`;
                resultArray.push(item);
            }
        });

        input1.innerHTML = markedHTML;
        output.value = resultArray.join('\n');

        // Update teks statistik
        stats.innerHTML = `<strong>Total awal:</strong> ${array1.length} | <strong>Cocok (Merah):</strong> ${array1.length - resultArray.length} | <strong>Sisa (Hijau):</strong> ${resultArray.length}`;
        
        // Simpan perubahan setelah proses selesai dilakukan
        autoSave();
    });

    // Fungsi Tombol Salin Teks
    btnCopy.addEventListener("click", () => {
        if (!output.value) {
            alert("Tidak ada teks di Output 3 yang bisa disalin!");
            return;
        }
        
        navigator.clipboard.writeText(output.value)
            .then(() => {
                const originalText = btnCopy.innerText;
                btnCopy.innerText = "Tersalin! ✓";
                setTimeout(() => {
                    btnCopy.innerText = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error("Gagal menyalin teks: ", err);
            });
    });

    // Fungsi Tombol Download (.txt)
    btnDownload.addEventListener("click", () => {
        if (!output.value) {
            alert("Tidak ada data untuk diunduh!");
            return;
        }

        const textToSave = output.value;
        const textBlob = new Blob([textToSave], { type: "text/plain" });
        const textUrl = URL.createObjectURL(textBlob);
        
        const downloadLink = document.createElement("a");
        downloadLink.download = "sisa_angka_output3.txt";
        downloadLink.href = textUrl;
        downloadLink.style.display = "none";
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});
