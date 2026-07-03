const db = require("../config/db");

// CREATE PACKAGE
exports.createPackage = async (req, res) => {

  console.log("DATA MASUK:", req.body);

  const {
    nama,
    alamat,
    user_id,
    latitude,
    longitude,
  } = req.body;

  if (
    !nama ||
    !alamat ||
    !user_id
  ) {
    return res.status(400).json({
      success: false,
      message: "Data tidak lengkap",
    });
  }

  const sql = `
    INSERT INTO packages
    (
      nama,
      alamat,
      user_id,
      latitude,
      longitude
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nama,
      alamat,
      user_id,
      latitude,
      longitude,
    ],
    (err, result) => {

      if (err) {

        console.log(
          "CREATE ERROR:",
          err
        );

        return res.status(500).json({
          success: false,
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message:
          "Data berhasil ditambahkan",
      });
    }
  );
};

// GET PACKAGE
exports.getPackages = (
  req,
  res
) => {

  const user_id =
    req.params.user_id;

  const sql =
    "SELECT * FROM packages WHERE user_id = ? ORDER BY id DESC";

  db.query(
    sql,
    [user_id],
    (err, result) => {

      if (err) {

        console.log(
          "GET ERROR:",
          err
        );

        return res.status(500).json({
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    }
  );
};

// DELETE PACKAGE
exports.deletePackage = (
  req,
  res
) => {

  const sql =
    "DELETE FROM packages WHERE id=?";

  db.query(
    sql,
    [req.params.id],
    (err, result) => {

      if (err) {

        console.log(
          "DELETE ERROR:",
          err
        );

        return res.status(500).json({
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
      });
    }
  );
};

// UPDATE PACKAGE
exports.updatePackage = (
  req,
  res
) => {

  const {
    nama,
    alamat,
  } = req.body;

  const sql =
    "UPDATE packages SET nama=?, alamat=? WHERE id=?";

  db.query(
    sql,
    [
      nama,
      alamat,
      req.params.id,
    ],
    (err, result) => {

      if (err) {

        console.log(
          "UPDATE ERROR:",
          err
        );

        return res.status(500).json({
          success: false,
        });
      }

      return res.status(200).json({
        success: true,
      });
    }
  );
};