// Versi Code: v1.1.0

document.addEventListener("DOMContentLoaded", () => {
    const btnProcess = document.getElementById("processBtn");
    const btnCopy = document.getElementById("copyBtn");
    const btnDownload = document.getElementById("downloadBtn");
    
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const output = document.getElementById("output");
    const stats = document.getElementById("stats");

    btnProcess.addEventListener("click", () => {
        // 1. Ambil teks asli dari div Input 1 (menggunakan innerText agar ganti baris terbaca konsisten)
        const rawData1 = input1.innerText;
        const rawData2 = input2.value;

        // 2. Pecah menjadi array dan bersihkan baris kosong
        const array1 = rawData1.split('\n')
            .map(line => line.trim())
            .filter(line => line !== "");
            
        const array2 = rawData2.split('\n')
            .map(line => line.trim())
            .filter(line => line !== "");

        const set2 = new Set(array2);
        
        let markedHTML = "";
        let resultArray = [];

        // 3. Iterasi data utama untuk membuat logika pencocokan warna (Mark)
        array1.forEach((item) => {
            if (set2.has(item)) {
                // Jika cocok dengan input 2 -> Bungkus dengan warna merah
                markedHTML += `<div class="match-red">${item}</div>`;
            } else {
                // Jika tidak cocok dengan input 2 -> Bungkus dengan warna hijau & masukkan ke output
                markedHTML += `<div class="nomatch-green">${item}</div>`;
                resultArray.push(item);
            }
        });

        // 4. Ubah tampilan di Input 1 menjadi teks yang sudah diwarnai
        input1.innerHTML = markedHTML;

        // 5. Masukkan sisa data ke Output 3
        output.value = resultArray.join('\n');

        // 6. Perbarui statistik data
        stats.innerText = `Total awal: ${array1.length} | Cocok (Merah): ${array1.length - resultArray.length} | Sisa (Hijau): ${resultArray.length}`;
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
        
        // Membuat elemen link unduhan sementara di memori browser
        const downloadLink = document.createElement("a");
        downloadLink.download = "sisa_angka_output3.txt";
        downloadLink.href = textUrl;
        downloadLink.style.display = "none";
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});
