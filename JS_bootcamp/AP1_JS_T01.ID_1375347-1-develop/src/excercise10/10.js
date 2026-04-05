function getMaxZeroCount(raw) {
  let tmp = 0;
  let current = 0;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] == "0") {
      current++;
      tmp = current > tmp ? current : tmp;
    } else {
      current = 0;
    }
  }
  return tmp;
}

// console.log(getMaxZeroCount("1010010001"));
// console.log(getMaxZeroCount("100100100"));
// console.log(getMaxZeroCount("11111"));
