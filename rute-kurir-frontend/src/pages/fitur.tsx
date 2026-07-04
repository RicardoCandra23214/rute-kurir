import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export default function Fitur() {
  const fiturRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true); // tampil
        } else {
          setShow(false); // reset animasi saat keluar layar
        }
      },
      { threshold: 0.3 }
    );

    if (fiturRef.current) observer.observe(fiturRef.current);

    return () => observer.disconnect();
  }, []);

  const animation = show
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-10";

  return (
    <section
      id="fitur"
      ref={fiturRef}
      className="pt-[90px] sm:pt-[100px] w-full min-h-screen px-4 sm:px-6 md:px-10 mt-5 pb-20"
    >
      <h1
        className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center transition-all duration-700 ease-out transform ${animation}`}
      >
        Fitur Unggulan Sistem Optimasi
      </h1>

      <p
        className={`text-gray-600 text-center text-base sm:text-lg md:text-xl mt-4 max-w-3xl mx-auto transition-all duration-700 ease-out transform delay-150 ${animation}`}
      >
        Teknologi canggih yang dirancang khusus untuk meningkatkan efisiensi kurir JNT
        Express Gajahmada Pontianak
      </p>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mt-10 sm:mt-14 md:mt-16 mx-auto max-w-7xl transition-all duration-700 ease-out transform delay-300 ${animation}`}
      >
        {/* Card 1 */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
            <Icon icon="material-symbols:route" className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mt-5">Optimasi Rute Pengiriman</h2>
          <p className="text-gray-600 mt-3">
            Sistem menghitung rute terpendek dan paling efisien berdasarkan alamat tujuan
            yang diupload
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
            <Icon icon="icon-park-outline:time" className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mt-5">Penghematan Waktu</h2>
          <p className="text-gray-600 mt-3">
            Rata-rata penghematan waktu 25% dari rute konvensional dengan algoritma canggih
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
            <Icon icon="lucide:fuel" className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mt-5">Hemat Bahan Bakar</h2>
          <p className="text-gray-600 mt-3">
            Mengurangi konsumsi BBM hingga 20% dengan rute yang lebih efisien
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
            <Icon icon="basil:location-outline" className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mt-5">Tepat Tujuan</h2>
          <p className="text-gray-600 mt-3">
            Paket akan dikirim tepat sasaran kepada pemilik paket
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
            <Icon icon="mynaui:upload-solid" className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mt-5">Upload Mudah</h2>
          <p className="text-gray-600 mt-3">
            Upload daftar alamat dalam format Excel atau input manual langsung di sistem
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-md text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
            <Icon icon="mdi:report-finance" className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold mt-5">Laporan Detail</h2>
          <p className="text-gray-600 mt-3">
            Dapatkan laporan lengkap performa pengiriman dan analisis efisiensi
          </p>
        </div>     
      </div>

      {/* Cara Kerja Sistem */}
<div
  className={`w-full py-10 sm:py-12 md:py-14 bg-gradient-to-b from-[#f4f8ff] to-[#f4f8ff] mt-16 sm:mt-20 md:mt-28 transition-all duration-700 ease-out transform delay-500 ${animation}`}
>
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
    Cara Kerja Sistem
  </h1>

  <p className="text-gray-600 text-center text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-3xl mx-auto px-4">
    Proses sederhana dalam 3 langkah untuk mengoptimalkan rute pengiriman Anda
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 md:gap-20 mt-12 sm:mt-16 md:mt-24 max-w-7xl w-full mx-auto text-center px-4 sm:px-6 pb-14">
    
    {/* Step 1 */}
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
        <Icon icon="mynaui:upload-solid" className="text-white text-3xl sm:text-5xl" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mt-5 sm:mt-7">1. Upload Alamat</h2>
      <p className="text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg max-w-sm">
        Upload daftar alamat tujuan pengiriman melalui file Excel atau input manual di dashboard.
      </p>
    </div>

    {/* Step 2 */}
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 to-red-500 flex items-center justify-center shadow-lg">
        <Icon icon="material-symbols:route" className="text-white text-3xl sm:text-5xl" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mt-5 sm:mt-7">2. Optimasi Otomatis</h2>
      <p className="text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg max-w-sm">
        Sistem menghitung rute terpendek dan paling efisien berdasarkan lokasi kurir saat ini.
      </p>
    </div>

    {/* Step 3 */}
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center shadow-lg">
        <Icon icon="mdi:truck-delivery-outline" className="text-white text-3xl sm:text-5xl" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mt-5 sm:mt-7">3. Mulai Pengiriman</h2>
      <p className="text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg max-w-sm">
        Ikuti rute yang telah dioptimalkan dan pantau progress pengiriman secara real-time.
      </p>
    </div>

  </div>
</div>


    </section>
  );
}