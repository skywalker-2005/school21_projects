#include "../../s21_decimal.h"
int is_zero(long_decimal dec) {
  int z = 1;
  for (int i = 0; i < 6; i++) {
    if (dec.bits[i] != 0) {
      z = 0;
      break;
    }
  }
  return z;
}
