function mergeSort(arrayOfNumbers) {
  if (arrayOfNumbers.length <= 1) {
    return arrayOfNumbers;
  }

  const middle = Math.floor(arrayOfNumbers.length / 2);
  const left = arrayOfNumbers.slice(0, middle);
  const right = arrayOfNumbers.slice(middle);

  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

// console.log(mergeSort([38, 27, 43, 3, 9, 82]));
// console.log(mergeSort([13, 45, 2, 11, 23, 17]));
// console.log(mergeSort([90, 24, 15, 2, 7, 40]));
