#include "../../s21_decimal.h"
void set_bit(long_decimal *src, unsigned int index, unsigned int value) {
  int bit = 5 - index / 32;
  int pos = 31 - index % 32;
  if (value == 0) src->bits[bit] &= ~(1 << pos);
  if (value == 1) src->bits[bit] |= (1 << pos);
}
