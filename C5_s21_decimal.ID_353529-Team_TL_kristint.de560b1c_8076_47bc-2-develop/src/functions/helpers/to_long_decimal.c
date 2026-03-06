#include "../../s21_decimal.h"
void to_long_decimal(s21_decimal src, long_decimal *result) {
  set_zero(result);
  result->stuff_bit = src.bits[3];
  for (int i = 0; i < 3; i++) result->bits[i] = src.bits[i];
}
