// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const homeRef = useRef(null);
  const [show, setShow] = useState(false);

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

    if (homeRef.current) observer.observe(homeRef.current);
    return () => observer.disconnect();
  }, []);

  const animation = show
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-10";

  return (
    <div
      ref={homeRef}
      className="min-h-screen bg-gradient-to-b from-[#fff7f7] to-[#f4f8ff]"
    >
      <section
        id="home"
        className="flex flex-col items-center text-center px-4 pt-[100px]"
      >
        <h1
          className={`text-6xl font-bold max-w-5xl leading-tight mt-16 transition-all duration-700 ease-out transform ${animation}`}
        >
          Optimasi Rute <span className="text-red-600">Kurir</span>{" "}
          <span className="text-blue-600">JNT</span> Express Gajahmada Pontianak
        </h1>

        <p
          className={`text-gray-600 max-w-3xl mt-7 text-xl transition-all duration-700 ease-out transform delay-150 ${animation}`}
        >
          Sistem yang mengoptimalkan jalur pengiriman untuk kurir JNT Express di
          Gajahmada, Pontianak. Membantu menghemat waktu, bahan bakar, serta
          meningkatkan efisiensi dalam proses pengiriman hingga
          <span className="font-bold text-red-600"> 25%</span>.
        </p>

        <div
          className={`flex gap-6 mt-12 transition-all duration-700 ease-out transform delay-300 ${animation}`}
        >
          <Link
            to="/login"
            className="px-8 py-4 rounded-md text-white font-semibold text-xl bg-gradient-to-r from-red-500 to-blue-600 shadow-lg transition transform hover:scale-105"
          >
            Mulai Optimasi Rute
          </Link>

          <Link
            to="/demo"
            className="px-8 py-4 rounded-md border-2 border-red-500 text-red-600 font-semibold text-xl hover:bg-red-600 hover:text-white transition transform hover:scale-105"
          >
            Lihat Demo
          </Link>
        </div>

        <div
          className={`mt-16 flex flex-wrap justify-center gap-56 text-center transition-all duration-700 ease-out transform delay-[450ms] ${animation}`}
        >
          <div className="flex flex-col items-center">
            <h2 className="text-5xl font-bold text-red-600">20</h2>
            <p className="text-xl text-black-600 font-medium">Kurir Aktif</p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl font-bold text-blue-600">30%</h2>
            <p className="text-xl text-black-600 font-medium">Tepat Sasaran</p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl font-bold text-red-600">18%</h2>
            <p className="text-xl text-black-600 font-medium">
              Penghematan BBM
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-5xl font-bold text-blue-600">25%</h2>
            <p className="text-xl text-black-600 font-medium">Hemat Waktu</p>
          </div>
        </div>
      </section>
    </div>
  );
}
