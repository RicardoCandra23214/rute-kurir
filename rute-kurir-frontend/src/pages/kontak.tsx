// src/pages/Kontak.tsx
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

export default function Kontak() {
  const kontakRef = useRef(null);
  const [show, setShow] = useState(false);

  // Observer animasi
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
        } else {
          setShow(false);
        }
      },
      { threshold: 0.3 }
    );

    if (kontakRef.current) observer.observe(kontakRef.current);

    return () => observer.disconnect();
  }, []);

  const animation = show
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-10";

  return (
    <section
      id="kontak"
      ref={kontakRef}
      className="w-full min-h-screen pt-[100px] sm:pt-[110px] md:pt-[120px] px-4 sm:px-6 md:px-10 pb-20 bg-white"
    >
      {/* Judul */}
      <h1
        className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center transition-all duration-700 ease-out transform ${animation}`}
      >
        Hubungi Tim Support
      </h1>

      <p
        className={`text-gray-600 text-center text-base sm:text-lg md:text-xl mt-4 transition-all duration-700 ease-out transform delay-150 ${animation}`}
      >
        Butuh bantuan atau ada pertanyaan? Tim support kami siap membantu Anda 24/7
      </p>

      {/* Layout kiri kanan */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mt-10 sm:mt-12 md:mt-14 max-w-7xl mx-auto transition-all duration-700 ease-out transform delay-300 ${animation}`}
      >
        {/* Kolom kiri */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* alamat/lokasi */}
          <div className="flex items-center gap-4 sm:gap-5 bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="shrink-0 w-14 h-12 sm:w-20 sm:h-14 rounded-xl bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
              <Icon icon="mdi:location" className="text-white text-2xl sm:text-3xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Lokasi</h3>
              <p className="text-gray-600 text-sm sm:text-base">X89Q+8XX, Jl. Gajah Mada, Benua Melayu Darat, Kec. Pontianak Sel., Kota Pontianak, Kalimantan Barat 78243</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 sm:gap-5 bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
              <Icon icon="mdi:email-edit" className="text-white text-2xl sm:text-3xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Email</h3>
              <p className="text-gray-600 text-sm sm:text-base">gajahmada@jnt.co.id</p>
            </div>
          </div>

          {/* WA */}
          <div className="flex items-center gap-4 sm:gap-5 bg-gray-50 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
              <Icon icon="ri:whatsapp-fill" className="text-white text-2xl sm:text-3xl" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">WhatsApp</h3>
              <p className="text-gray-600 text-sm sm:text-base">+0852-5234-5617</p>
            </div>
          </div>
        </div>

        {/* Kolom kanan (Form) */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Kirim Pesan</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Isi form dibawah ini dan tim kami akan segera menghubungi Anda
          </p>

          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="No. Telepon"
                className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows={5}
              placeholder="Pesan Anda"
              className="p-3 border rounded-md outline-none resize-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-lg bg-gradient-to-r from-red-500 to-blue-600 shadow-md hover:opacity-90"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}