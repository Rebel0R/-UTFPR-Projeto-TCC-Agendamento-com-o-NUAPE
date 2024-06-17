const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Função para criar um hash da senha
async function encryptPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);

    const encryptedPassword = await bcrypt.hash(password, salt);
    console.log("Senha criptograda com sucesso!");
    return encryptedPassword;
  } catch (error) {
    throw new Error("Erro ao criar hash da senha: " + error.message);
  }
}

async function comparePassword(password, hashedPassword) {
  try {
    // Comparando a senha fornecida com o hash armazenado
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("Erro ao comparar a senha: " + error.message);
  }
}

function encryptText(text, key) {
  const derivedKey = crypto.createHash("sha256").update(key).digest();
  const iv = crypto.randomBytes(16); // Gere um vetor de inicialização aleatório
  const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
}

function decryptText(encryptedData, key) {
  const derivedKey = crypto.createHash("sha256").update(key).digest();
  const iv = Buffer.from(encryptedData.iv, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);
  let decrypted = decipher.update(encryptedData.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encryptPassword, comparePassword, encryptText, decryptText };
