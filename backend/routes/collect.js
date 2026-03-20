const express = require("express");
const router = express.Router();
const db = require("../db");
const decrypt = require("../utils/decrypt");

router.post("/", (req, res) => {
  try {
    const { e, cid, d } = req.body;

    const extra = decrypt(d);

    const sql = `
      INSERT INTO trackgoogle (event, click_id, uid, url, referrer, device)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      e,
      cid,
      extra.uid,
      extra.url,
      extra.referrer,
      extra.device
    ]);

    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

module.exports = router;
