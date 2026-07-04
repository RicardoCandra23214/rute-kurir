import { Link, useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  isDashboard?: boolean;
}

export default function Navbar({ isDashboard = false }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-5 md:py-7 shadow-sm bg-white/70 backdrop-blur-lg fixed top-0 left-0 z-50">

      {/* LOGO */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
        <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg text-white font-bold text-sm sm:text-base md:text-xl flex items-center justify-center">
          JNT
        </div>

        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-bold text-base sm:text-xl md:text-3xl truncate">JNT Express</span>
          <span className="hidden sm:block text-xs md:text-sm text-gray-500 truncate">
            JNT Express Gajahmada Pontianak
          </span>
        </div>
      </div>

      {/* LANDING PAGE NAV */}
      {!isDashboard && (
        <>
          <nav className="hidden md:flex gap-8 lg:gap-12 text-gray-700 font-medium text-base lg:text-lg shrink-0">
            <button onClick={() => handleScroll("beranda")}>
              Beranda
            </button>

            <Link to="/login">Dashboard</Link>

            <button onClick={() => handleScroll("fitur")}>
              Fitur
            </button>

            <button onClick={() => handleScroll("kontak")}>
              Kontak
            </button>
          </nav>

          <Link
            to="/login"
            className="shrink-0 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-md text-white font-medium text-sm sm:text-base md:text-lg bg-gradient-to-r from-red-500 to-blue-600 transition transform hover:scale-105 shadow-lg"
          >
            Login
          </Link>
        </>
      )}

      {/* DASHBOARD NAV */}
      {isDashboard && (
        <Link
          to="/"
          className="shrink-0 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-md text-white font-medium text-sm sm:text-base md:text-lg bg-red-500 hover:bg-red-600 transition"
        >
          Logout
        </Link>
      )}
    </header>
  );
}