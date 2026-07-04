import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-white py-12 sm:py-16 md:py-20 px-5 sm:px-10 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12 md:gap-14">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg text-white font-bold text-lg sm:text-xl flex items-center justify-center">
              JNT
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-xl sm:text-2xl md:text-3xl">JNT Express</span>
              <span className="text-xs sm:text-sm text-gray-400">Route Optimizer Kembayan</span>
            </div>
          </div>

          <p className="text-gray-400 mt-4 max-w-sm leading-relaxed">
            Sistem optimasi rute terdepan untuk kurir JNT Express Kembayan. Meningkatkan
            efisiensi pengiriman dengan teknologi AI.
          </p>
        </div>

        {/* Menu Cepat */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Menu Cepat</h3>
          <ul className="text-gray-300 space-y-3">
            <li><a href="#home" className="hover:text-white">Beranda</a></li>
            <li><a href="#fitur" className="hover:text-white">Fitur</a></li>
            <li><a href="/optimize" className="hover:text-white">Dashboard</a></li>
            <li><a href="#kontak" className="hover:text-white">Kontak</a></li>
          </ul>
        </div>

        {/* Kontak Kami */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Kontak Kami</h3>
          <ul className="text-gray-300 space-y-4">
            <li className="flex gap-3">
              <span className="text-red-400"><Icon icon="ion:location-outline" className="text-red-600 text-3xl" /></span>
              Jl. Raya Kembayan No. 123, Sanggau, Kalimantan Barat
            </li>
            <li className="flex gap-3">
              <span className="text-red-400"><Icon icon="prime--whatsapp" className="text-red-600 text-3xl" /></span>
              +62 561-123-456
            </li>
            <li className="flex gap-3">
              <span className="text-red-400"><Icon icon="mdi--email-outline" className="text-red-600 text-3xl" /></span>
              kembayan@jnt.co.id
            </li>
          </ul>
        </div>

        {/* Jam Operasional */}
        <div>
          <h3 className="font-semibold text-xl mb-4">Jam Operasional</h3>
          <ul className="text-gray-300 space-y-4">
            <li>
              <span className="font-semibold">Senin - Sabtu</span><br />08:00 - 17:00 WIB
            </li>
            <li>
              <span className="font-semibold">Minggu</span><br />08:00 - 14:00 WIB
            </li>
          </ul>
        </div>
      </div>

      {/* Garis */}
      <div className="mt-16 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between text-gray-400 text-sm">
        <p>© 2025 JNT Express Kembayan Route Optimizer. All rights reserved.</p>

        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}