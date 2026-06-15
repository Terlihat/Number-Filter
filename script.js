// Versi Code: v1.0.0

document.addEventListener("DOMContentLoaded", () => {
    const btnProcess = document.getElementById("processBtn");
    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const output = document.getElementById("output");
    const stats = document.getElementById("stats");

    btnProcess.addEventListener("click", () => {
        // 1. Ambil nilai dari textarea
        const rawData1 = input1.value;
        const rawData2 = input2.value;

        // 2. Pecah berdasarkan baris baru (enter), hapus spasi berlebih, 
        // dan buang baris yang kosong.
        const array1 = rawData1.split('\n')
            .map(line => line.trim())
            .filter(line => line !== "");
            
        const array2 = rawData2.split('\n')
            .map(line => line.trim())
            .filter(line => line !== "");

        // 3. Masukkan array2 ke dalam struktur "Set"
        // Set digunakan agar proses pencarian (mencocokkan) jauh lebih cepat 
        // secara performa dibandingkan array biasa.
        const set2 = new Set(array2);

        // 4. Proses Logika Inti: 
        // Saring (filter) array1, HANYA simpan baris yang TIDAK ADA di set2
        const resultArray = array1.filter(item => !set2.has(item));

        // 5. Tampilkan hasilnya ke Output 3, gabungkan kembali dengan baris baru
        output.value = resultArray.join('\n');

        // 6. (Opsional) Tampilkan informasi jumlah baris
        stats.innerText = `Total awal: ${array1.length} | Dihapus: ${array1.length - resultArray.length} | Sisa: ${resultArray.length}`;
    });
});
