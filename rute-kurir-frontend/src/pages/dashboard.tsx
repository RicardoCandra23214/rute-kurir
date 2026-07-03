/// <reference types="leaflet" />
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Navbar from "../components/navbar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options: any): any;
  }
}

interface AddressItem {
  id: number;
  nama: string;
  alamat: string;
  status?: string;
  latitude?: number;
  longitude?: number;
}

const RoutingMachine = ({ optimizedRoute }: { optimizedRoute: any[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!optimizedRoute.length) return;

    const courierPosition = L.latLng(-0.03158538648446664, 109.33996895006426);

    const waypoints = [
      courierPosition,
      ...optimizedRoute.map((item) => L.latLng(item.latitude, item.longitude)),
    ];

    const routingControl = L.Routing.control({
      waypoints,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: "foot",
      }),
      lineOptions: {
        styles: [{ color: "#2563eb", weight: 5 }],
      },
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, optimizedRoute]);

  return null;
};

const ChangeMapView = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 17);
  }, [lat, lng, map]);

  return null;
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // State
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<AddressItem | null>(null);

  // Form
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [originalAddress, setOriginalAddress] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  // Kamera OCR (scan resi)
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit
  const [editId, setEditId] = useState<number | null>(null);

  const courierPosition: [number, number] = [-0.03158538648446664, 109.33996895006426];

  // Fetch Data
  const fetchPackages = async () => {
    if (!user.id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/packages/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Add Data
  const handleAddData = async () => {
    if (!nama || !alamat || !selectedLat || !selectedLng) {
      alert("Cari lokasi terlebih dahulu");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          alamat: originalAddress || alamat,
          user_id: user.id,
          latitude: selectedLat,
          longitude: selectedLng,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchPackages();
        resetForm();
        alert("Data berhasil ditambahkan");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setNama("");
    setAlamat("");
    setOriginalAddress("");
    setSearchLocation("");
    setLocationResults([]);
    setSelectedLat(null);
    setSelectedLng(null);
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/packages/${id}`, { method: "DELETE" });
      fetchPackages();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (item: AddressItem) => {
    setSelectedPackage(item);
    setShowDeleteModal(true);
  };

  // Parsing hasil teks OCR -> nama & alamat (dipakai upload file maupun kamera)
  const extractFromOcrText = (ocrText: string) => {
    const lines = ocrText
      .split("\n")
      .map((l: string) => l.trim())
      .filter(Boolean);

    // Baris-baris yang menandakan blok alamat sudah berakhir (field lain di resi)
    const STOP_PATTERNS =
      /^(KAB\.?|KOTA|KEC\.?|KECAMATAN|CASHLESS|COD|PICK[\s-]?UP|Antar ke counter|Berat|Biaya Kirim|Batas Kirim|No\.?\s*Pesanan|No\.?\s*SLS|Nama Produk|Pengirim|Pesan\s*:)/i;

    // Baris yang isinya mayoritas angka (nomor telepon) - dideteksi dari rasio
    // digit, bukan exact match, karena OCR sering salah baca label "HOME/OFFICE"
    const isPhoneLikeLine = (line: string) => {
      const cleaned = line.replace(/[^0-9a-zA-Z]/g, "");
      if (cleaned.length === 0) return false;
      const digitCount = (cleaned.match(/\d/g) || []).length;
      return digitCount / cleaned.length > 0.6 && digitCount >= 8;
    };

    const penerimaIndex = lines.findIndex((l) => /penerima/i.test(l));

    let namaHasil = "";
    let alamatLines: string[] = [];

    if (penerimaIndex !== -1) {
      const penerimaMatch = lines[penerimaIndex].match(/Penerima[:\s]+(.+)/i);

      // Resi 2 kolom kadang ke-OCR jadi satu baris ("...Penerima: X — Pengirim: Y"),
      // potong di kata "Pengirim" biar nama gak ke-gabung sama data pengirim
      namaHasil = penerimaMatch
        ? penerimaMatch[1].split(/Pengirim/i)[0].replace(/[—–-]\s*$/, "").trim()
        : "";

      for (let i = penerimaIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        if (STOP_PATTERNS.test(line)) break;
        if (isPhoneLikeLine(line)) continue;

        alamatLines.push(line);
      }
    } else {
      // Fallback kalau label "Penerima" gak ke-detect sama sekali
      alamatLines = lines.slice(1, 5);
    }

    const alamatHasil = alamatLines.join(", ").replace(/,\s*,/g, ",").trim();

    return { nama: namaHasil, alamat: alamatHasil };
  };

  // Jalankan OCR ke blob/file (dipakai baik dari capture kamera maupun upload file).
  // Foto cuma dipakai sesaat buat ambil teks alamat - tidak disimpan di database,
  // dan file sementaranya juga dihapus otomatis di backend setelah diproses.
  const runOcrOnBlob = async (blob: Blob, filename: string) => {
    setCameraLoading(true);
    setCameraError("");

    try {
      const formData = new FormData();
      formData.append("image", blob, filename);

      const response = await fetch("http://localhost:5000/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        setCameraError("OCR gagal membaca resi, coba lagi.");
        return;
      }

      const { nama: namaHasil, alamat: alamatHasil } = extractFromOcrText(data.text);

      if (!alamatHasil) {
        setCameraError(
          "Teks alamat tidak terbaca jelas. Coba foto ulang dengan pencahayaan lebih baik dan resi terlihat penuh."
        );
        return;
      }

      if (namaHasil) setNama(namaHasil);
      setAlamat(alamatHasil);
      setOriginalAddress(alamatHasil);

      closeCamera();
    } catch (error) {
      console.error(error);
      setCameraError("Terjadi kesalahan saat memproses OCR.");
    } finally {
      setCameraLoading(false);
    }
  };

  // ====== KAMERA OCR (SCAN RESI) ======

  // Buka kamera untuk scan resi
  const openCamera = async () => {
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;
      setShowCameraModal(true);

      // Tunggu video element ke-render dulu sebelum attach stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (error) {
      console.error(error);
      // Kamera gagal dibuka (izin ditolak / tidak ada kamera) -
      // modal tetap dibuka supaya user masih bisa upload dari galeri
      setCameraError(
        "Tidak bisa mengakses kamera. Pastikan izin kamera sudah diberikan, atau pakai opsi upload foto di bawah."
      );
      setShowCameraModal(true);
    }
  };

  // Tutup kamera & lepas stream
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setShowCameraModal(false);
    setCameraError("");
  };

  // Ambil foto dari video lalu kirim ke endpoint OCR
  const captureAndScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      setCameraError("Kamera belum siap, tunggu sebentar lalu coba lagi.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        runOcrOnBlob(blob, "resi.jpg");
      },
      "image/jpeg",
      0.9
    );
  };

  // Upload foto resi dari galeri/file (alternatif selain capture kamera langsung)
  const handleUploadResiFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    runOcrOnBlob(file, file.name);

    // Reset value supaya file yang sama bisa dipilih ulang nanti
    e.target.value = "";
  };

  // Pastikan kamera dimatikan kalau komponen unmount saat kamera masih nyala
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Search Address
 const searchAddress = async (keyword: string) => {
  if (!keyword.trim()) {
    alert("Masukkan alamat terlebih dahulu");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/search-location?q=${encodeURIComponent(keyword)}`
    );
    const data = await response.json();

    if (!data || data.length === 0) {
      alert("Alamat tidak ditemukan, pastikan penulisannya benar");
      return;
    }

    // Ambil lokasi pertama
    const location = data[0];
    setSelectedLat(location.geometry.coordinates[1]);
    setSelectedLng(location.geometry.coordinates[0]);

  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat mencari alamat");
  }
};

  // Edit
  const handleEdit = (item: AddressItem) => {
    setNama(item.nama);
    setAlamat(item.alamat);
    setEditId(item.id);
    // Modal edit bisa ditambahkan nanti
  };

  // Optimize Route
  const handleOptimize = async () => {
    if (!user.id) return;
    setIsOptimizing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/optimize-route/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setOptimizedRoute(data.route);
        setAddresses(data.route);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Move Row
  const moveRow = (index: number, direction: "up" | "down") => {
    const updated = [...addresses];
    if (direction === "up" && index > 0) {
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
    }
    if (direction === "down" && index < updated.length - 1) {
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    }
    setAddresses(updated);
    setOptimizedRoute(updated);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar isDashboard />

      <div className="p-6 pt-32 space-y-6">
        {/* Map Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b flex flex-wrap gap-3 items-end">
            {/* Nama Penerima */}
            <div>
              <input
                type="text"
                placeholder="Nama Penerima"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="border px-3 py-2 rounded-lg w-64"
              />
            </div>

             {/* Alamat + Search */}
              <div className="flex-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: jalan danau sentarum, gang sentarum jaya no A5. sungai bangkong pontianak kota"
                    value={alamat}
                    onChange={(e) => {
                      setAlamat(e.target.value);
                      setOriginalAddress(e.target.value);
                    }}
                    className="border px-3 py-2 rounded-lg flex-1"
                  />
                  <button
                    type="button"
                    onClick={openCamera}
                    title="Scan resi pakai kamera"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition flex items-center justify-center"
                  >
                    <Icon icon="mdi:camera" width={20} height={20} />
                  </button>
                  <button
                    onClick={() => searchAddress(alamat)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Cari
                  </button>
                </div>
              </div>
           
            <button
              onClick={handleAddData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
            >
              + Tambah Alamat
            </button>
          </div>

          {/* Map */}
          <div className="h-[300px]">
            {/* MAP CONTAINER */}
              <div className="h-[250px]">
                <MapContainer
                  center={courierPosition}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Auto center ke lokasi yang dipilih */}
                  {selectedLat !== null && selectedLng !== null && (
                    <ChangeMapView lat={selectedLat} lng={selectedLng} />
                  )}

                  {/* TITIK KURIR */}
                  <Marker position={courierPosition}>
                    <Popup>JNT Express Gajah Mada</Popup>
                  </Marker>

                  {/* MARKER YANG BISA DIGESER MANUAL */}
                    {selectedLat !== null && selectedLng !== null && (
                      <Marker
                        position={[selectedLat, selectedLng]}
                        draggable={true}
                        eventHandlers={{
                          dragend: (e: any) => {
                            const lat = e.target.getLatLng().lat;
                            const lng = e.target.getLatLng().lng;
                            
                            setSelectedLat(lat);
                            setSelectedLng(lng);
                            
                            // Optional: console untuk debug
                            console.log("Marker digeser ke:", lat, lng);
                          },
                        }}
                      >
                        <Popup>
                          📍 <strong>Geser marker ini</strong> untuk menyesuaikan lokasi lebih akurat
                        </Popup>
                      </Marker>
                    )}

                  {/* SEMUA ALAMAT PAKET */}
                  {addresses.map((item) =>
                    item.latitude && item.longitude ? (
                      <Marker
                        key={item.id}
                        position={[item.latitude, item.longitude]}
                      >
                        <Popup>
                          <div>
                            <h3 className="font-semibold">{item.nama}</h3>
                            <p>{item.alamat}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ) : null
                  )}

                  {/* MARKER RUTE YANG SUDAH DIOPTIMASI */}
                  {optimizedRoute.map((item: any, index: number) => {
                    const numberIcon = L.divIcon({
                      className: "custom-number-icon",
                      html: `
                        <div style="
                          background:blue;
                          color:white;
                          width:28px;
                          height:28px;
                          border-radius:9999px;
                          display:flex;
                          align-items:center;
                          justify-content:center;
                          font-weight:bold;
                          border:2px solid white;
                        ">
                          ${index + 1}
                        </div>
                      `,
                    });

                    return (
                      <Marker
                        key={item.id || index}
                        position={[item.latitude, item.longitude]}
                        icon={numberIcon}
                      >
                        <Popup>
                          <div>
                            <h3 className="font-semibold">{item.nama}</h3>
                            <p>{item.alamat}</p>
                            <p className="text-blue-600 font-medium mt-1">
                              Urutan ke-{index + 1}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}

                  {/* GARIS RUTE */}
                  <RoutingMachine optimizedRoute={optimizedRoute} />
                </MapContainer>
              </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Data Paket</h2>
              <p className="text-gray-500">{addresses.length} paket</p>
            </div>

            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
            >
              {isOptimizing ? "Mengoptimasi..." : "🔄 Optimasi Rute"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">No</th>
                  <th className="border p-3 text-left">Nama Penerima</th>
                  <th className="border p-3 text-left">Alamat</th>
                  <th className="border p-3 text-center">Urutan</th>
                  <th className="border p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {addresses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border p-8 text-center text-gray-500">
                      Belum ada data paket
                    </td>
                  </tr>
                ) : (
                  addresses.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border p-3">{index + 1}</td>
                      <td className="border p-3 font-medium">{item.nama}</td>
                      <td className="border p-3">{item.alamat}</td>
                      <td className="border p-3">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => moveRow(index, "up")}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveRow(index, "down")}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                          >
                            ↓
                          </button>
                        </div>
                      </td>
                      <td className="border p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(item)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white w-[400px] rounded-2xl p-6">
            <h2 className="text-xl font-semibold">Konfirmasi Hapus</h2>
            <p className="mt-3 text-gray-600">
              Yakin ingin menghapus paket atas nama{" "}
              <span className="font-semibold">{selectedPackage.nama}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPackage(null);
                }}
                className="border px-5 py-2 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedPackage.id);
                  setShowDeleteModal(false);
                  setSelectedPackage(null);
                }}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Optimize */}
      {isOptimizing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 font-medium">Mengoptimasi rute...</p>
          </div>
        </div>
      )}

      {/* Modal Kamera - Scan Resi */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3 text-center">
              Arahkan kamera ke resi
            </h2>

            <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadResiFile}
              className="hidden"
            />

            <p className="text-xs text-gray-400 text-center mt-2">
              Foto resi hanya dipakai sekali untuk membaca alamat, tidak disimpan.
            </p>

            {cameraError && (
              <p className="text-red-500 text-sm mt-2 text-center">{cameraError}</p>
            )}

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={captureAndScan}
                disabled={cameraLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                {cameraLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:camera" width={18} height={18} />
                    Ambil &amp; Scan
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={cameraLoading}
                className="border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 px-6 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Icon icon="mdi:image-multiple-outline" width={18} height={18} />
                Upload Foto dari Galeri
              </button>

              <button
                onClick={closeCamera}
                disabled={cameraLoading}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50 px-5 py-2 rounded-lg text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;