// Versi Code: v1.3.0

// Fungsi pemicu klik element file input tersembunyi (dipanggil dari HTML)
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
    const dedupCheck = document.getElementById("dedupCheck");

    const fileInput1 = document.getElementById("fileInput1");
    const fileInput2 = document.getElementById("fileInput2");

    // ==========================================
    // LOGIKA AUTO SAVE & LOAD LOCAL STORAGE
    // ==========================================
    const autoSave = () => {
        localStorage.setItem("nft_v3_input1", input1.innerHTML);
        localStorage.setItem("nft_v3_input2", input2.value);
        localStorage.setItem("nft_v3_output", output.value);
        localStorage.setItem("nft_v3_stats", stats.innerHTML);
        localStorage.setItem("nft_v3_dedup", dedupCheck.checked);
    };

    const loadSavedData = () => {
        if (localStorage.getItem("nft_v3_input1")) input1.innerHTML = localStorage.getItem("nft_v3_input1");
        if (localStorage.getItem("nft_v3_input2")) input2.value = localStorage.getItem("nft_v3_input2");
        if (localStorage.getItem("nft_v3_output")) output.value = localStorage.getItem("nft_v3_output");
        if (localStorage.getItem("nft_v3_stats")) stats.innerHTML = localStorage.getItem("nft_v3_stats");
        if (localStorage.getItem("nft_v3_dedup")) dedupCheck.checked = (localStorage.getItem("nft_v3_dedup") === 'true');
    };

    loadSavedData();

    input1.addEventListener("input", autoSave);
    input2.addEventListener("input", autoSave);
    dedupCheck.addEventListener("change", autoSave);

    // ==========================================
    // FITUR CLEAR BUTTONS
    // ==========================================
    document.getElementById("clearInput1").addEventListener("click", () => { input1.innerHTML = ""; autoSave(); });
    document.getElementById("clearInput2").addEventListener("click", () => { input2.value = ""; autoSave(); });
    document.getElementById("clearOutput").addEventListener("click", () => { output.value = ""; autoSave(); });

    // ==========================================
    // FITUR DRAG & DROP & FILE UPLOAD
    // ==========================================
    const handleFile = (file, targetElement) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            if (targetElement === input1) {
                // Untuk Div ContentEditable, kita pecah per baris agar Line Number CSS bekerja sejak awal
                const lines = text.split('\n').map(l => l.trim()).filter(l => l !== "");
                targetElement.innerHTML = lines.map(line => `<div>${line}</div>`).join('');
            } else {
                targetElement.value = text;
            }
            autoSave();
        };
        reader.readAsText(file);
    };

    // Event listener untuk tombol upload file biasa
    fileInput1.addEventListener("change", (e) => { if(e.target.files[0]) handleFile(e.target.files[0], input1); });
    fileInput2.addEventListener("change", (e) => { if(e.target.files[0]) handleFile(e.target.files[0], input2); });

    // Setup area Drag & Drop
    [input1, input2].forEach(element => {
        element.addEventListener("dragover", (e) => { e.preventDefault(); element.classList.add("drag-over"); });
        element.addEventListener("dragleave", () => { element.classList.remove("drag-over"); });
        element.addEventListener("drop", (e) => {
            e.preventDefault();
            element.classList.remove("drag-over");
            if (e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0], element);
            }
        });
    });

    // ==========================================
    // LOGIKA INTI PROSES & VALIDASI (MARK)
    // ==========================================
    btnProcess.addEventListener("click", () => {
        const rawData1 = input1.innerText;
        const rawData2 = input2.value;

        let array1 = rawData1.split('\n').map(line => line.trim()).filter(line => line !== "");
        const array2 = rawData2.split('\n').map(line => line.trim()).filter(line => line !== "");

        // Fitur Pembersih Duplikat Internal Input 1
        if (dedupCheck.checked) {
            array1 = [...new Set(array1)];
        }

        const set2 = new Set(array2);
        
        let markedHTML = "";
        let resultArray = [];
        let countYellow = 0;
        let countRed = 0;
        let countGreen = 0;

        // Regex Validasi: Harus berupa angka dan panjangnya tepat 16 digit
        const isDigit16 = /^\d{16}$/;

        array1.forEach((item) => {
            if (!isDigit16.test(item)) {
                // Gagal Validasi -> Warna Kuning (Warning)
                markedHTML += `<div class="warning-yellow">${item} [Bukan 16 Digit]</div>`;
                countYellow++;
            } else if (set2.has(item)) {
                // Cocok dengan Input 2 -> Warna Merah
                markedHTML += `<div class="match-red">${item}</div>`;
                countRed++;
            } else {
                // Unik / Tidak cocok -> Warna Hijau & Lolos Ke Output
                markedHTML += `<div class="nomatch-green">${item}</div>`;
                resultArray.push(item);
                countGreen++;
            }
        });

        // Terapkan ke DOM
        input1.innerHTML = markedHTML || "<div></div>"; 
        output.value = resultArray.join('\n');

        // Render Statistik Baru yang super detail
        stats.innerHTML = `<strong>Total Awal:</strong> ${array1.length} | ` +
                          `<strong>Cocok (Merah):</strong> ${countRed} | ` +
                          `<strong>Sisa (Hijau):</strong> ${countGreen} | ` +
                          `<strong>Error (Kuning):</strong> ${countYellow}`;
        
        autoSave();
    });

    // ==========================================
    // TOMBOL AKSI: COPY & DOWNLOAD
    // ==========================================
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
