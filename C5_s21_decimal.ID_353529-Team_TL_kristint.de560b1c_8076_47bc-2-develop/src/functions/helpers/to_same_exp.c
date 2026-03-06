#include "../../s21_decimal.h"
void exp_low(long_decimal *value);
void to_same_exp(long_decimal *value_1, long_decimal *value_2) {
  exp_low(value_1);
  exp_low(value_2);
  int diff = get_exp(*value_1) - get_exp(*value_2);
  long_decimal *tmp = value_2;
  if (diff < 0) {
    diff *= -1;
    tmp = value_1;
  }
  for (int i = 0; i < diff; i++) mul_by_ten(tmp);
  set_exp(tmp, get_exp(*tmp) + diff);
}
void exp_low(long_decimal *value) {
  int diff = get_exp(*value) - 28;

  if (diff > 0) {
    if (diff > 30) {
      set_zero(value);
      set_exp(value, 0);
    } else {
      for (int i = 0; i < diff; i++) {
        div_by_ten(value);
      }
      set_exp(value, get_exp(*value) - diff);
    }
  }
}
