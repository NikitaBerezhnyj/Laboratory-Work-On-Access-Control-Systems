const fs = require("fs");

function generateKeyTable(key) {
  let dicty = new Array(26).fill(0);
  let keyT = new Array(5).fill(null).map(() => new Array(5));

  key = key.replace(/[^a-zA-Z]/g, "").toLowerCase();

  for (let i = 0; i < key.length; i++) {
    let r = key[i].charCodeAt(0) - 97;
    if (key[i] !== "j" && dicty[r] === 0) dicty[r] = 1;
  }

  dicty["j".charCodeAt(0) - 97] = 1;
  let i = 0,
    j = 0;

  for (let k = 0; k < key.length; k++) {
    let r = key[k].charCodeAt(0) - 97;
    if (dicty[r] === 1) {
      dicty[r] = 2;
      keyT[i][j] = key[k];
      j++;
      if (j === 5) {
        i++;
        j = 0;
      }
    }
  }

  for (let k = 0; k < 26; k++) {
    if (dicty[k] === 0) {
      keyT[i][j] = String.fromCharCode(k + 97);
      j++;
      if (j === 5) {
        i++;
        j = 0;
      }
    }
  }

  return keyT;
}

function search(keyT, a, b, arr) {
  if (a === "j") a = "i";
  if (b === "j") b = "i";

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (keyT[i][j] === a) (arr[0] = i), (arr[1] = j);
      if (keyT[i][j] === b) (arr[2] = i), (arr[3] = j);
    }
  }

  return arr;
}

function prepare(str) {
  if (str.length % 2 !== 0) str += "z";
  return str;
}

function encrypt(str, keyT) {
  let newStr = [];
  let a = new Array(4).fill(0);

  str = str.replace(/\s/g, "");

  for (let i = 0; i < str.length; i += 2) {
    let brr = search(keyT, str[i], str[i + 1], a);
    let k1 = brr[0],
      k2 = brr[1],
      k3 = brr[2],
      k4 = brr[3];

    if (k1 === k3) {
      newStr[i] = keyT[k1][(k2 + 1) % 5];
      newStr[i + 1] = keyT[k1][(k4 + 1) % 5];
    } else if (k2 === k4) {
      newStr[i] = keyT[(k1 + 1) % 5][k2];
      newStr[i + 1] = keyT[(k3 + 1) % 5][k2];
    } else {
      newStr[i] = keyT[k1][k4];
      newStr[i + 1] = keyT[k3][k2];
    }
  }

  return newStr.join("");
}

function playfairCipherEncrypt(text, key) {
  text = text.toLowerCase().replace(/[^a-z]/g, "");
  key = key.toLowerCase().replace(/[^a-z]/g, "");

  let keyT = generateKeyTable(key);
  text = prepare(text);

  return encrypt(text, keyT);
}

function decrypt(str, keyT) {
  let newStr = [];
  let a = new Array(4).fill(0);

  for (let i = 0; i < str.length; i += 2) {
    let brr = search(keyT, str[i], str[i + 1], a);
    let k1 = brr[0],
      k2 = brr[1],
      k3 = brr[2],
      k4 = brr[3];

    if (k1 === k3) {
      newStr[i] = keyT[k1][(k2 - 1 + 5) % 5];
      newStr[i + 1] = keyT[k1][(k4 - 1 + 5) % 5];
    } else if (k2 === k4) {
      newStr[i] = keyT[(k1 - 1 + 5) % 5][k2];
      newStr[i + 1] = keyT[(k3 - 1 + 5) % 5][k2];
    } else {
      newStr[i] = keyT[k1][k4];
      newStr[i + 1] = keyT[k3][k2];
    }
  }

  return newStr.join("");
}

function playfairCipherDecrypt(text, key) {
  text = text.toLowerCase().replace(/[^a-z]/g, "");
  key = key.toLowerCase().replace(/[^a-z]/g, "");

  let keyT = generateKeyTable(key);
  text = prepare(text);

  let decryptedText = decrypt(text, keyT);
  return decryptedText.replace(/z/g, " ");
}

async function encryptFile(inputFilePath, outputFilePath, key) {
  try {
    const data = await fs.promises.readFile(inputFilePath, "utf8");
    const encryptedText = playfairCipherEncrypt(data, key);
    await fs.promises.writeFile(outputFilePath, encryptedText);
  } catch (err) {
    console.error("Помилка при обробці файлу:", err);
  }
}

async function decryptFile(inputFilePath, outputFilePath, key) {
  try {
    const data = await fs.promises.readFile(inputFilePath, "utf8");
    const decryptedText = playfairCipherDecrypt(data, key);
    await fs.promises.writeFile(outputFilePath, decryptedText);
  } catch (err) {
    console.error("Помилка при обробці файлу:", err);
  }
}

async function processFiles() {
  const key = "exampleKey";
  const inputFilePath = "input.txt";
  const encryptedFilePath = "encrypted.txt";
  const decryptedFilePath = "decrypted.txt";

  try {
    await encryptFile(inputFilePath, encryptedFilePath, key);
    console.log("Текст зашифровано в файл", encryptedFilePath);
    await decryptFile(encryptedFilePath, decryptedFilePath, key);
    console.log("Текст дешифровано в файл", decryptedFilePath);
  } catch (err) {
    console.error(err);
  }
}

processFiles();
