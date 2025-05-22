function convertToEnglish(text) {
  const turkish = ["ş", "Ş", "ı", "İ", "ç", "Ç", "ü", "Ü", "ö", "Ö", "ğ", "Ğ"];
  const english = ["s", "S", "i", "I", "c", "C", "u", "U", "o", "O", "g", "G"];

  for (let i = 0; i < turkish.length; i++) {
    text = text.split(turkish[i]).join(english[i]);
  }

  return text;
}

export default convertToEnglish;
