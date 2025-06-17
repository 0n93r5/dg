let currentViewers = Math.floor(Math.random() * 1000) + 3000; // Mulai dari 3.000 - 4.000

            function formatNumber(number) {
                return number.toLocaleString('id-ID'); // Format angka: 3.605
            }

            function updateViewerCounter() {
                const counter = document.getElementById('counter-success');
                if (!counter) return;

                // Tambah atau kurang penonton secara acak: ±5 sampai ±30
                const change = Math.floor(Math.random() * 26) + 5;
                const direction = Math.random() < 0.5 ? -1 : 1;

                currentViewers += change * direction;

                // Batasi minimum dan maksimum viewers
                if (currentViewers < 2000) currentViewers = 2000;
                if (currentViewers > 10000) currentViewers = 10000;

                counter.textContent = `${formatNumber(currentViewers)} sedang menonton`;
            }

            // Jalankan saat halaman dimuat
            updateViewerCounter();

            // Update setiap 5 detik (bisa kamu ubah)
            setInterval(updateViewerCounter, 5000);
