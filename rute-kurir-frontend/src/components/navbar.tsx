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
    <header className="w-full flex items-center justify-between px-14 py-7 shadow-sm bg-white/70 backdrop-blur-lg fixed top-0 left-0 z-50">

      {/* LOGO */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-600 rounded-lg text-white font-bold text-xl px-1 py-2">
          JNT
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-bold text-3xl">JNT Express</span>
          <span className="text-sm text-gray-500">
            JNT Express Gajahmada Pontianak
          </span>
        </div>
      </div>

      {/* LANDING PAGE NAV */}
      {!isDashboard && (
        <>
          <nav className="hidden md:flex gap-12 text-gray-700 font-medium text-lg">
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
            className="px-6 py-3 rounded-md text-white font-medium text-lg bg-gradient-to-r from-red-500 to-blue-600 transition transform hover:scale-105 shadow-lg"
          >
            Login
          </Link>
        </>
      )}

      {/* DASHBOARD NAV */}
      {isDashboard && (
        <Link
          to="/"
          className="px-6 py-3 rounded-md text-white font-medium text-lg bg-red-500 hover:bg-red-600 transition"
        >
          Logout
        </Link>
      )}
    </header>
  );
}