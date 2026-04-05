function binarySearch(arrayOfNumbers, num) {
  let left = 0;
  let right = arrayOfNumbers.length - 1;
  while (left <= right) {
    let mid = Math.floor((right + left) / 2);
    if (arrayOfNumbers[mid] > num) {
      right = --mid;
    } else if (arrayOfNumbers[mid] < num) {
      left = ++mid;
    } else if (arrayOfNumbers[mid] == num) {
      return mid;
    }
  }
  return -1;
}

// console.log(binarySearch([1, 2, 3, 4, 5, 6], 4));
// console.log(binarySearch([2, 4, 6, 8, 10], 8));
// console.log(binarySearch([-10, -5, 0, 5, 10], 0));
