function getNOD(first, second) {
  while (second != 0) {
    let temp = second;
    second = first % second;
    first = temp;
  }
  return first;
}

// console.log(getNOD(3, 6));
// console.log(getNOD(0, 2));
// console.log(getNOD(5, 5));
// console.log(getNOD(1, 3));
// console.log(getNOD(0, 0));
