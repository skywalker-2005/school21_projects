#include "../../s21_decimal.h"

void set_zero(long_decimal *decimal) {
  for (int i = 0; i < 6; i++) {
    decimal->bits[i] = 0;
  }
  decimal->stuff_bit = 0;
}
