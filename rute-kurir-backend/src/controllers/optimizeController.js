const db = require("../config/db");

const {
  nearestNeighbor
} = require("../utils/nearestNeighbor");

const optimizeRoute = async (req, res) => {

  const { userId } = req.params;

  const sql = `
    SELECT *
    FROM packages
    WHERE user_id = ?
    AND latitude IS NOT NULL
    AND longitude IS NOT NULL
  `;

  db.query(sql, [userId], async (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    const startPoint = {
      latitude: -0.03158538648446664,
      longitude: 109.33996895006426,
    };

    const optimized =
      await nearestNeighbor(
        startPoint,
        result
      );

    res.json({
      success: true,
      total: optimized.length,
      route: optimized,
    });
  });
};

module.exports = { optimizeRoute };