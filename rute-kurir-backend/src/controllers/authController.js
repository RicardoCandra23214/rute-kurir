const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // cek email
    const checkEmail =
      "SELECT * FROM users WHERE email = ?";

    db.query(checkEmail, [email], async (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "Email sudah digunakan",
        });
      }

      // hash password
      const hashedPassword =
        await bcrypt.hash(password, 10);

      // insert user
      const sql =
        "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)";

      db.query(
        sql,
        [nama, email, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.status(201).json({
            message: "Register berhasil",
          });
        }
      );
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


// LOGIN
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    const sql =
      "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Email tidak ditemukan",
        });
      }

      const user = result[0];

      // cek password
      const isMatch =
        await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Password salah",
        });
      }

      // token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
        },
      });

    });

  } catch (error) {
    res.status(500).json(error);
  }
};