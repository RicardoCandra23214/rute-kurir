const express = require("express");
const axios = require("axios");

const router = express.Router();


const OTHER_AREA_KEYWORDS = [
  "jakarta", "surabaya", "bandung", "medan", "semarang", "makassar",
  "palembang", "denpasar", "yogyakarta", "jogja", "malang", "bogor",
  "depok", "tangerang", "bekasi", "solo", "surakarta", "pekanbaru",
  "padang", "manado", "balikpapan", "samarinda", "banjarmasin",
  "singkawang", "sambas", "mempawah", "kubu raya", "sanggau",
  "sintang", "ketapang", "landak", "bengkayang", "melawi", "sekadau",
  "kayong utara", "batam", "cirebon", "tasikmalaya", "cimahi", "tegal",
  "purwokerto", "kediri", "jember", "gresik", "sidoarjo", "lampung",
  "aceh", "bali", "lombok",
];

// Deteksi kalau alamat eksplisit menyebut kota/kabupaten selain Pontianak
const containsOtherAreaKeyword = (text) => {

  const lower = text.toLowerCase();

  return OTHER_AREA_KEYWORDS.some(
    (kw) => new RegExp(`\\b${kw}\\b`, "i").test(lower)
  );
};

// Pastikan hasil geocoding BENAR-BENAR di Pontianak, bukan cuma kebetulan
// nama jalannya sama dengan kota lain
const isInPontianak = (feature) => {

  const props = feature.properties || {};

  const area = `${props.city || ""} ${props.county || ""} ${props.state || ""}`
    .toLowerCase();

  return area.includes("pontianak");
};

const searchGeoapify = async (keyword) => {

  const response = await axios.get(
    "https://api.geoapify.com/v1/geocode/search",
    {
      params: {
        text: `${keyword} Pontianak Kalimantan Barat`,
        filter: "countrycode:id",
        limit: 5,
        apiKey: process.env.GEOAPIFY_API_KEY
      }
    }
  );

  const features = response.data.features || [];

  // Buang hasil yang ternyata bukan di Pontianak
  return features.filter(isInPontianak);
};

router.get("/search-location", async (req, res) => {

  try {

    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    // TOLAK LANGSUNG KALAU ALAMAT JELAS DI LUAR PONTIANAK
    if (containsOtherAreaKeyword(q)) {

      console.log(
        "DITOLAK - alamat menyebut wilayah lain:",
        q
      );

      return res.json([]);
    }

    // NORMALISASI ALAMAT
    const keyword = q
      .replace(/\bjl\b/gi, "jalan")
      .replace(/\bgg\b/gi, "gang")
      .replace(/\bkec\b/gi, "kecamatan")
      .replace(/\bkota\b/gi, "")
      .trim();

    console.log("QUERY FINAL:", keyword);

    // PENCARIAN PERTAMA
    let result =
      await searchGeoapify(keyword);

    if (result.length > 0) {

      console.log("Exact Match");

      return res.json(result);
    }

    // CARI POLA GANG + NOMOR
    const gangMatch = keyword.match(
      /gang\s+([a-zA-Z\s]+?)\s*(\d+)/i
    );

    const jalanMatch = keyword.match(
      /jalan\s+([a-zA-Z\s]+)/i
    );

    if (
      gangMatch &&
      jalanMatch
    ) {

      const namaGang =
        gangMatch[1].trim();

      const nomorGang =
        parseInt(gangMatch[2]);

      const namaJalan =
        jalanMatch[1].trim();

      console.log(
        "Nama Gang:",
        namaGang
      );

      console.log(
        "Nomor Gang:",
        nomorGang
      );

      console.log(
        "Nama Jalan:",
        namaJalan
      );

      // CARI NOMOR TERDEKAT
      for (
        let offset = 1;
        offset <= 5;
        offset++
      ) {

        const bawah =
          nomorGang - offset;

        const atas =
          nomorGang + offset;

        if (bawah > 0) {

          const keywordBawah =
            `Gang ${namaGang} ${bawah} Jalan ${namaJalan}`;

          result =
            await searchGeoapify(
              keywordBawah
            );

          if (
            result.length > 0
          ) {

            console.log(
              "Fallback Bawah:",
              keywordBawah
            );

            return res.json(
              result
            );
          }
        }

        const keywordAtas =
          `Gang ${namaGang} ${atas} Jalan ${namaJalan}`;

        result =
          await searchGeoapify(
            keywordAtas
          );

        if (
          result.length > 0
        ) {

          console.log(
            "Fallback Atas:",
            keywordAtas
          );

          return res.json(
            result
          );
        }
      }

      // TANPA NOMOR GANG
      const keywordGang =
        `Gang ${namaGang} Jalan ${namaJalan}`;

      result =
        await searchGeoapify(
          keywordGang
        );

      if (
        result.length > 0
      ) {

        console.log(
          "Fallback Gang:",
          keywordGang
        );

        return res.json(
          result
        );
      }
    }

    // HANYA JALAN
    if (jalanMatch) {

      const keywordJalan =
        `Jalan ${jalanMatch[1].trim()}`;

      result =
        await searchGeoapify(
          keywordJalan
        );

      if (
        result.length > 0
      ) {

        console.log(
          "Fallback Jalan:",
          keywordJalan
        );

        return res.json(
          result
        );
      }
    }

    console.log(
      "Tidak ditemukan"
    );

    return res.json([]);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        "Gagal mencari lokasi"
    });
  }

});

module.exports = router;