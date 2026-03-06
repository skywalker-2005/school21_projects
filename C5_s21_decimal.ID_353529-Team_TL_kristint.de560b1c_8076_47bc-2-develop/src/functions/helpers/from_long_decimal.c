#include <stdio.h>
#include <string.h>

#include "../../s21_decimal.h"

long get_upper_bit_sum(long_decimal src);
int from_long_decimal(long_decimal src, s21_decimal *result) {
  int error = OK, sign = get_sign(src), exp = get_exp(src), ost = 5;
  set_sign(&src, 0);
  while ((get_upper_bit_sum(src) > 0 && exp > 0) || exp > 28) {
    ost = div_by_ten(&src);
    exp--;
    if (ost >= 5 && src.bits[0] % 2 == 1) {
      long_decimal one = {{1, 0, 0, 0, 0, 0}, exp};
      add_long(src, one, &src);
    }
  }
  if (get_upper_bit_sum(src) == 0) {
    for (int i = 0; i < 3; i++) result->bits[i] = src.bits[i];
    set_sign(&src, sign);
    set_exp(&src, exp);
    result->bits[3] = src.stuff_bit;
  } else {
    error = 1 + sign;
    for (int i = 0; i < 4; i++) result->bits[i] = 0;
  }
  return error;
}
long get_upper_bit_sum(long_decimal src) {
  long tmp = 0;
  for (int i = 3; i < 6; i++) tmp += src.bits[i];
  return tmp;
}
