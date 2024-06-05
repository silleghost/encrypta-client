import { Buffer } from "buffer";
window.Buffer = Buffer;
import CryptoJS from "crypto-js";

const decToHexString = (decimalString) => {
  return parseInt(decimalString, 10).toString(16).padStart(16, "0");
};

const generateTOTPCodeWithExpiry = (secret, timestamp) => {
  const decodedSecret = Buffer.from(secret, "base64");
  const counter = Math.floor(timestamp / 30);
  const counterHex = decToHexString(counter.toString());

  const hash = CryptoJS.HmacSHA1(decodedSecret);
  // .update(Buffer.from(counterHex, "hex"))
  // .digest();

  const offset = hash.readUInt8(hash.length - 1) & 0xf;
  const value = (hash.readInt32BE(offset) & 0x7fffffff) % 1000000;

  const code = value.toString().padStart(6, "0");
  const expiry = (counter + 1) * 30 * 1000;

  return { code, expiry };
};

export default generateTOTPCodeWithExpiry;
