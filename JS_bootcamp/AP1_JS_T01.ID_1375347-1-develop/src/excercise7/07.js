function sma(arrayOfNumbers, period) {
  let mas = [];
  let first = 0,
    second = 0;
  for (let i = 0; i < arrayOfNumbers.length; i++) {
    let count = 0;
    for (let j = first; j - second >= 0; j--) {
      count += arrayOfNumbers[j];
    }
    if (first - second < period - 1) {
      first++;
    } else {
      first++;
      second++;
    }
    mas.push(count / period);
  }
  return mas;
}

console.log(sma([1, 2, 3], 3));
console.log(sma([1, 2, 3], 1));
console.log(sma([1, 2, 3], 2));
console.log(sma([1, 2, 3, 4, 5, 6], 2));

// function sma2(arrayOfNumbers, period) {
//   let mas = [];
//   let count = 0;
//   let prev = 0;
//   for (let i = 0; i < arrayOfNumbers.length; i++) {
//     count += arrayOfNumbers[i];
//     if (i - prev == period) {
//       count -= arrayOfNumbers[prev];
//       prev++;
//     }
//     mas.push(count / period);
//   }
//   return mas;
// }

// console.log(sma2([1, 2, 3], 3));
// console.log(sma2([1, 2, 3], 1));
// console.log(sma2([1, 2, 3], 2));
// console.log(sma2([1, 2, 3, 4, 5, 6], 2));
