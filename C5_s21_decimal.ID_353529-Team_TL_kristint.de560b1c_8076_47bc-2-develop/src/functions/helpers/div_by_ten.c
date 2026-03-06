#include "../../s21_decimal.h"
int div_by_ten(long_decimal *value) {
  long_decimal result = {};
  unsigned int tmp = 0;
  for (int i = 0; i < 192; i++) {
    tmp <<= 1;
    tmp += get_bit(*value, i);
    left_shift(&result);
    if (tmp >= 10) {
      tmp -= 10;
      result.bits[0] += 1;
    }
  }
  decimal_copy(value, result);
  return tmp;
}
