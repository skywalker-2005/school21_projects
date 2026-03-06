#include "../s21_decimal.h"

int s21_from_int_to_decimal(int src, s21_decimal *dst) {
  long_decimal dst_1 = {};
  if (src < 0) {
    set_sign(&dst_1, 1);
    src = (-1) * src;
  }
  dst_1.bits[0] = src;
  from_long_decimal(dst_1, dst);
  return 0;
}