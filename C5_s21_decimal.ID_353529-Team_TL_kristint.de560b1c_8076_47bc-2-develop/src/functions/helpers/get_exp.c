#include "../../s21_decimal.h"
unsigned int get_exp(long_decimal value) {
  unsigned int exp = value.stuff_bit;
  exp -= get_sign(value) << 31;
  exp >>= 16;
  return exp;
}
