#include "../../s21_decimal.h"
unsigned int get_bit(long_decimal value, unsigned int index) {
  int bit = 5 - index / 32;
  int pos = 31 - index % 32;
  return (value.bits[bit] & (1 << pos)) != 0;
}
