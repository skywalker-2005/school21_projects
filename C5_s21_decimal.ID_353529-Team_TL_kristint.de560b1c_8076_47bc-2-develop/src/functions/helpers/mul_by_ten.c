#include "../../s21_decimal.h"
void mul_by_ten(long_decimal *value) {
  long_decimal tmp1 = {}, tmp2 = {}, result = {};
  decimal_copy(&tmp1, *value);
  decimal_copy(&tmp2, *value);
  left_shift(&tmp1);
  left_shift(&tmp1);
  add_long(tmp1, tmp2, &result);
  left_shift(&result);
  decimal_copy(value, result);
}
