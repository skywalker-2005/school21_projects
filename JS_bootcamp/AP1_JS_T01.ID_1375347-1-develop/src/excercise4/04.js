function getSimpleNumbers(touple) {
  const sito = new Array(touple[1] + 1).fill(true);
  sito[0] = sito[1] = false;
  for (let i = 2; i * i <= touple[1] + 1; i++) {
    if (sito[i]) {
      for (let j = i * i; j <= touple[1]; j += i) {
        sito[j] = false;
      }
    }
  }
  return sito
    .map((prime, index) => (prime ? index : null))
    .filter(Boolean)
    .filter((num) => num <= touple[1] && num >= touple[0]);
}

console.log(getSimpleNumbers([2, 10]));
console.log(getSimpleNumbers([2, 2]));
