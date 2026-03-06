#include "../../s21_decimal.h"
void set_exp(long_decimal *decimal, unsigned int value) {
  value <<= 16;
  decimal->stuff_bit = (get_sign(*decimal) << 31) + value;
}
