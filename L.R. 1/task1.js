const alphabets = {
  ua: "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя",
  en: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: ".,!?-+=:;()[]{}/@#$%^&*<>'\"|\\~`",
};

function toRot13(text, shift) {
  return processText(text, shift, true);
}

function fromRot13(text, shift) {
  return processText(text, shift, false);
}

function processText(text, shift, shouldEncrypt) {
  let result = "";
  shift = shouldEncrypt ? shift : -shift;

  const fullAlphabet =
    alphabets.ua +
    alphabets.ua.toUpperCase() +
    alphabets.en +
    alphabets.en.toUpperCase() +
    alphabets.numbers +
    alphabets.symbols;

  for (let char of text) {
    const index = fullAlphabet.indexOf(char);

    if (index === -1) {
      result += char;
      continue;
    }

    let newIndex = (index + shift) % fullAlphabet.length;

    if (newIndex < 0) {
      newIndex += fullAlphabet.length;
    }

    result += fullAlphabet[newIndex];
  }

  return result;
}

// Демонстрація шифрування
const originalText = "nikita";
const shift = 3;
const encryptedText = toRot13(originalText, shift);

console.log("Демонстрація роботи шифру Цезаря:");
console.log("Оригінальний текст:", originalText);
console.log("Зашифрований текст:", encryptedText);
console.log("Розшифрований текст:", fromRot13(encryptedText, shift));
