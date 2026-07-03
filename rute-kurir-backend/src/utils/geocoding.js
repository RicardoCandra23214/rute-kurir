const axios = require("axios");

// EKSTRAK AREA
const extractArea = (alamat) => {

  const text = alamat.toLowerCase();

  // =========================
  // TEMPAT USAHA / POI
  // =========================

  const businessKeywords = [
    "coffee",
    "coffe",
    "cafe",
    "kafe",
    "alfamart",
    "indomaret",
    "mixue",
    "apotek",
    "hotel",
    "restoran",
    "rumah makan",
    "warung",
    "toko",
    "kampus",
    "bengkel",
    "masjid",
    "bank",
    "supermarket",
    "minimarket",
    "sekolah",
    "universitas",
    "perkantoran",
    "puskesmas",
    "klinik",
    "rumah sakit",
    "pasar",
    "mall",
    "depot",
    "laundry",
    "salon",
    "barbershop",
    "warnet",
    "perpustakaan",
    "studio",
    "bioskop",
    "gym",
    "fitness",
    "gereja",
    "vihara",
    "klenteng",
    "terminal",
    "bandara",
    "pelabuhan",
    "stasiun",
    "pabrik",
    "gudang"
  ];

  for (const keyword of businessKeywords) {

    if (text.includes(keyword)) {

      return alamat;
    }
  }

  // =========================
  // GANG
  // =========================

  const gangMatch =
    text.match(
      /(gang|gg\.?)\s+([a-z0-9\s]{2,40})/i
    );

  // =========================
  // JALAN
  // =========================

  const jalanMatch =
    text.match(
      /(jalan|jl\.?)\s+([a-z0-9\s]{2,40})/i
    );

  let gangName = "";
  let jalanName = "";

  if (gangMatch) {

    gangName = gangMatch[2]
      .split("no")[0]
      .split("pontianak")[0]
      .split(",")[0]
      .trim();
  }

  if (jalanMatch) {

    jalanName = jalanMatch[2]
      .split("gang")[0]
      .split("gg")[0]
      .split("no")[0]
      .split("pontianak")[0]
      .split(",")[0]
      .trim();
  }

  // =========================
  // GANG + JALAN
  // =========================

  if (gangName && jalanName) {

    return `Gang ${gangName} Jalan ${jalanName}`;
  }

  // =========================
  // HANYA JALAN
  // =========================

  if (jalanName) {

    return `Jalan ${jalanName}`;
  }

  // =========================
  // FALLBACK
  // =========================

  return alamat;
};

// GEOCODING
const getCoordinates = async (alamat) => {

  try {

    const area = extractArea(alamat);

    console.log("=================================");
    console.log("ALAMAT ASLI:", alamat);
    console.log("AREA HASIL:", area);

    const query =
      `${area}, Pontianak`;

    console.log("QUERY:", query);

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=json` +
      `&limit=5` +
      `&q=${encodeURIComponent(query)}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "rute-kurir-app"
      }
    });

    console.log("RESPONSE NOMINATIM:");
    console.log(
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    if (!response.data.length) {

      return {
        latitude: null,
        longitude: null,
        normalized_area: area,
      };
    }

    let selectedLocation =
      response.data[0];

    // PRIORITASKAN YANG MENGANDUNG KATA GANG
    const gangResult =
      response.data.find(
        item =>
          item.display_name &&
          item.display_name
            .toLowerCase()
            .includes("gang")
      );

    if (gangResult) {

      selectedLocation =
        gangResult;
    }

    console.log(
      "LOKASI TERPILIH:"
    );

    console.log(
      selectedLocation.display_name
    );

    return {

      latitude:
        parseFloat(
          selectedLocation.lat
        ),

      longitude:
        parseFloat(
          selectedLocation.lon
        ),

      normalized_area: area,
    };

  } catch (error) {

    console.log(
      "ERROR GEOCODING:"
    );

    console.log(error);

    return {

      latitude: null,

      longitude: null,

      normalized_area: alamat,
    };
  }
};

module.exports = {
  getCoordinates,
};