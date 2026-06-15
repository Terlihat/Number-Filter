// Versi Code: v1.4.0

function triggerUpload(id) {
    document.getElementById(id).click();
}

document.addEventListener("DOMContentLoaded", () => {
    const btnProcess = document.getElementById("processBtn");
    const btnCopy = document.getElementById("copyBtn");
    const btnDownload = document.getElementById("downloadBtn");
    
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const output = document.getElementById("output");
    const stats = document.getElementById("stats");
    const fileInput1 = document.getElementById("fileInput1");
    const fileInput2 = document.getElementById("fileInput2");

    // Local Storage menggunakan key "v4" agar fresh (tidak bentrok dengan versi lalu)
    const autoSave = () => {
        localStorage.setItem("nft_v4_input1", input1.innerHTML);
        localStorage.setItem("nft_v4_input2", input2.value);
        localStorage.setItem("nft_v4_output", output.value);
        localStorage.setItem("nft_v4_stats", stats.innerHTML);
    };

    const loadSavedData = () => {
        if (localStorage.getItem("nft_v4_input1")) input1.innerHTML = localStorage.getItem("nft_v4_input1");
        if (localStorage.getItem("nft_v4_input2")) input2.value = localStorage.getItem("nft_v4_input2");
        if (localStorage.getItem("nft_v4_output")) output.value = localStorage.getItem("nft_v4_output");
        if (localStorage.getItem("nft_v4_stats")) stats.innerHTML = localStorage.getItem("nft_v4_stats");
    };

    loadSavedData();
    input1.addEventListener("input", autoSave);
    input2.addEventListener("input", autoSave);

    document.getElementById("clearInput1").addEventListener("click", () => { input1.innerHTML = ""; autoSave(); });
    document.getElementById("clearInput2").addEventListener("click", () => { input2.value = ""; autoSave(); });
    document.getElementById("clearOutput").addEventListener("click", () => { output.value = ""; autoSave(); });

    const handleFile = (file, targetElement) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            if (targetElement === input1) {
                const lines = text.split('\n').map(l => l.trim()).filter(l => l !== "");
                targetElement.innerHTML = lines.map(line => `<div>${line}</div>`).join('');
            } else {
                targetElement.value = text;
            }
            autoSave();
        };
        reader.readAsText(file);
    };

    fileInput1.addEventListener("change", (e) => { if(e.target.files[0]) handleFile(e.target.files[0], input1); });
    fileInput2.addEventListener("change", (e) => { if(e.target.files[0]) handleFile(e.target.files[0], input2); });

    [input1, input2].forEach(element => {
        element.addEventListener("dragover", (e) => { e.preventDefault(); element.classList.add("drag-over"); });
        element.addEventListener("dragleave", () => { element.classList.remove("drag-over"); });
        element.addEventListener("drop", (e) => {
            e.preventDefault();
            element.classList.remove("drag-over");
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], element);
        });
    });

    // ==========================================
    // LOGIKA PROSES, VALIDASI & DETEKSI DUPLIKAT
    // ==========================================
    btnProcess.addEventListener("click", () => {
        const rawData1 = input1.innerText;
        const rawData2 = input2.value;

        const array1 = rawData1.split('\n').map(line => line.trim()).filter(line => line !== "");
        const array2 = rawData2.split('\n').map(line => line.trim()).filter(line => line !== "");

        const set2 = new Set(array2);
        
        // Objek Set untuk menyimpan angka yang sudah muncul di Input 1
        const seenInInput1 = new Set();
        
        let markedHTML = "";
        let resultArray = [];
        
        let countYellow = 0;
        let countRed = 0;
        let countGreen = 0;
        let countPurple = 0;

        const isDigit16 = /^\d{16}$/;

        array1.forEach((item) => {
            if (!isDigit16.test(item)) {
                // Warning: Bukan 16 Digit -> Kuning
                markedHTML += `<div class="warning-yellow">${item} [Bukan 16 Digit]</div>`;
                countYellow++;
            } else if (seenInInput1.has(item)) {
                // Deteksi Duplikat -> Ungu (Jika angka ini sudah pernah dicek sebelumnya)
                markedHTML += `<div class="duplicate-purple">${item} [Duplikat]</div>`;
                countPurple++;
            } else {
                // Tambahkan angka ke daftar "sudah dilihat"
                seenInInput1.add(item);
                
                if (set2.has(item)) {
                    // Ada di Input 2 -> Merah
                    markedHTML += `<div class="match-red">${item}</div>`;
                    countRed++;
                } else {
                    // Bersih -> Hijau & Lolos Output
                    markedHTML += `<div class="nomatch-green">${item}</div>`;
                    resultArray.push(item);
                    countGreen++;
                }
            }
        });

        input1.innerHTML = markedHTML || "<div></div>"; 
        output.value = resultArray.join('\n');

        // Render Statistik yang diperbarui dengan metrik Ungu
        stats.innerHTML = `<strong>Total Awal:</strong> ${array1.length} <br>` +
                          `🟩 <strong>Sisa (Hijau):</strong> ${countGreen} | ` +
                          `🟥 <strong>Dihapus (Merah):</strong> ${countRed} <br>` +
                          `🟪 <strong>Duplikat (Ungu):</strong> ${countPurple} | ` +
                          `🟨 <strong>Error (Kuning):</strong> ${countYellow}`;
        
        autoSave();
    });

    btnCopy.addEventListener("click", () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const originalText = btnCopy.innerText;
            btnCopy.innerText = "Tersalin! ✓";
            setTimeout(() => btnCopy.innerText = originalText, 1500);
        });
    });

    btnDownload.addEventListener("click", () => {
        if (!output.value) return;
        const textBlob = new Blob([output.value], { type: "text/plain" });
        const textUrl = URL.createObjectURL(textBlob);
        const downloadLink = document.createElement("a");
        downloadLink.download = "hasil_filter_output3.txt";
        downloadLink.href = textUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});
