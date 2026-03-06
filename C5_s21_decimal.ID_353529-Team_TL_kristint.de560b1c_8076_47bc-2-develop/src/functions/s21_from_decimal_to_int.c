#include "../s21_decimal.h"

int s21_from_decimal_to_int(s21_decimal src, int *dst) {
  long_decimal src_1 = {};
  to_long_decimal(src, &src_1);
  int flag = 0, exp = get_exp(src_1);
  double buffer = 0;
  for (int i = 191; i >= 0; i--) {
    buffer += get_bit(src_1, i) * pow(2, 191 - i);
  }
  buffer /= pow(10, exp);
  if (buffer > INT_MAX) {
    flag = 1;
  } else {
    if (get_sign(src_1)) {
      buffer *= (-1);
    }
    *dst = buffer;
  }
  return flag;
}