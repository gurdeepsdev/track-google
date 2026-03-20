require("dotenv").config();

function decrypt(encoded) {
  const key = process.env.SECRET_KEY;
  const decoded = Buffer.from(encoded, "base64").toString("utf-8");

  let result = "";

  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(
      decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }

  return JSON.parse(result);
}

module.exports = decrypt;
