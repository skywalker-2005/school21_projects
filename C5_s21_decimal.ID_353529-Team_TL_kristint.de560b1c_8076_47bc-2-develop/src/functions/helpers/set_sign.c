#include "../../s21_decimal.h"
void set_sign(long_decimal *src, unsigned int value) {
  if (value == 1) {
    src->stuff_bit |= (1u << 31);
  }
  if (value == 0) {
    src->stuff_bit &= ~(1u << 31);
  }
}
