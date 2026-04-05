let list = {
  a: "def",
  b: "efc",
  c: "abe",
  d: "cba",
  e: "fba",
  f: "dcb",
};

function alphabetMap(rawString, mapCount) {
  let str = "";
  for (let i = 0; i < rawString.length; i++) {
    str += list[rawString[i]];
  }
  while (mapCount != 1) str = alphabetMap(str, --mapCount);
  return str;
}

// console.log(alphabetMap("abcdef", 1));
// console.log(alphabetMap("aa", 2));
// console.log(alphabetMap("bad", 1));
