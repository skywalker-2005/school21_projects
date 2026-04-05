function getNumbersIdBySum(arrayOfNumbers, sum) {
  let mas = [];
  for (let i = 0; i < arrayOfNumbers.length - 1; i++) {
    for (let j = i + 1; j < arrayOfNumbers.length; j++) {
      if (arrayOfNumbers[i] + arrayOfNumbers[j] == sum && mas.length < 2) {
        mas.push(i, j);
      }
    }
  }
  if (mas.length === 0) return null;
  else return mas;
}

// console.log(getNumbersIdBySum([1, 2, 3, 4, 5], 6));
// console.log(getNumbersIdBySum([1, 0, 5], 2));
// console.log(getNumbersIdBySum([1, 0], 1));
// console.log(getNumbersIdBySum([1, 2, 3, 4, 5], 0));
