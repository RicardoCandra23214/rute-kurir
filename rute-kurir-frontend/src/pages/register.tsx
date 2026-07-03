import illustration from "../assets/img/jnt-login.png";

import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          nama,
          email,
          password,
        }
      );

      toast.success(
        response.data.message
      );

      // delay lalu pindah login
      setTimeout(() => {

        navigate("/login");

      }, 2000);

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Register gagal"
      );

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      {/* CONTAINER */}
      <div className="
        w-full
        max-w-5xl
        bg-white
        rounded-[25px]
        shadow-2xl
        overflow-hidden
        flex
        flex-col
        md:flex-row
      ">

        {/* LEFT SIDE */}
        <div className="hidden md:block md:w-1/2">

          <img
            src={illustration}
            alt="Illustration"
            className="w-full h-full object-cover"
          />

        </div>

        {/* RIGHT SIDE */}
        <div className="
          md:w-1/2
          w-full
          flex
          items-center
          justify-center
          px-6
          py-10
          md:px-12
        ">

          <div className="w-full max-w-[340px]">

            {/* TITLE */}
            <h1 className="
              text-4xl
              md:text-5xl
              font-extrabold
              bg-gradient-to-r
              from-red-600
              to-blue-700
              bg-clip-text
              text-transparent
              mb-6
              text-center
            ">
              REGISTER
            </h1>

            {/* SUB TITLE */}
            <h2 className="
              text-2xl
              md:text-4xl
              font-bold
              text-gray-800
              mb-6
              leading-tight
            ">
              Buat Akun Baru
            </h2>

            {/* NAMA */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e) =>
                  setNama(e.target.value)
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  text-base
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>

            {/* EMAIL */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Alamat Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  text-base
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  text-base
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleRegister}
              className="
                w-full
                py-3
                rounded-xl
                text-white
                text-lg
                md:text-xl
                font-bold
                bg-gradient-to-r
                from-red-600
                to-blue-700
                hover:opacity-90
                transition
                duration-300
                shadow-lg
              "
            >
              DAFTAR
            </button>

            {/* LOGIN */}
            <p className="text-center text-gray-700 mt-6 text-sm">

              Sudah punya akun?{" "}

              <Link
                to="/login"
                className="
                  text-blue-700
                  font-bold
                  hover:underline
                "
              >
                Login Sekarang
              </Link>

            </p>

          </div>
        </div>
      </div>
    </div>
  );
}