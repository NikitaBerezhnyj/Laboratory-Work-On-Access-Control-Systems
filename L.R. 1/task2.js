const alphabets = {
  ua: "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя",
  en: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: ".,!?-+=:;()[]{}/@#$%^&*<>'\"|\\~`",
};

function toVigenere(text, key) {
  return processVigenere(text, key, true);
}

function fromVigenere(text, key) {
  return processVigenere(text, key, false);
}

function processVigenere(text, key, shouldEncrypt) {
  let result = "";
  const fullAlphabet =
    alphabets.ua +
    alphabets.ua.toUpperCase() +
    alphabets.en +
    alphabets.en.toUpperCase() +
    alphabets.numbers +
    alphabets.symbols;

  let keyIndex = 0;
  for (let char of text) {
    const charIndex = fullAlphabet.indexOf(char);
    if (charIndex === -1) {
      result += char;
      continue;
    }

    const keyChar = key[keyIndex % key.length];
    const keyCharIndex = fullAlphabet.indexOf(keyChar);
    let shift = shouldEncrypt ? keyCharIndex : -keyCharIndex;

    let newIndex = (charIndex + shift) % fullAlphabet.length;
    if (newIndex < 0) {
      newIndex += fullAlphabet.length;
    }

    result += fullAlphabet[newIndex];

    keyIndex++;
  }

  return result;
}

// Демонстрація шифрування
const originalText = "nikita";
const key = "testKey";
const encryptedText = toVigenere(originalText, key);

console.log("Демонстрація роботи шифру Віженера:");
console.log("Оригінальний текст:", originalText);
console.log("Зашифрований текст:", encryptedText);
console.log("Розшифрований текст:", fromVigenere(encryptedText, key));
