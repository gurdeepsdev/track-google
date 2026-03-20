const express = require("express");
const router = express.Router();
const db = require("../db");
const decrypt = require("../utils/decrypt");


router.post("/", (req, res) => {
  try {
    const { e, cid, d } = req.body;

    let extra = {};

    // ✅ Fallback logic
    try {
      extra = decrypt(d);
    } catch (err) {
      console.log("⚠️ Decryption failed, trying plain JSON");

      try {
        extra = JSON.parse(d);
      } catch (e2) {
        console.log("❌ Invalid payload, using empty object");
        extra = {};
      }
    }

    // ✅ Safe defaults
    const uid = extra.uid || null;
    const url = extra.url || null;
    const referrer = extra.ref || extra.referrer || null;
    const device = extra.device || null;

    const sql = `
      INSERT INTO trackgoogle (event, click_id, uid, url, referrer, device)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [e, cid, uid, url, referrer, device], (err) => {
      if (err) {
        console.log("DB ERROR:", err);
      }
    });

    res.send("OK");

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).send("Error");
  }
});

module.exports = router;