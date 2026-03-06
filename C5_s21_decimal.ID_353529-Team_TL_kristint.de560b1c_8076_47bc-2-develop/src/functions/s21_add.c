#include "../s21_decimal.h"

int s21_add(s21_decimal value_1, s21_decimal value_2, s21_decimal *result) {
  long_decimal val_1 = {}, val_2 = {}, res = {};
  to_long_decimal(value_1, &val_1);
  to_long_decimal(value_2, &val_2);
  add_long(val_1, val_2, &res);
  return from_long_decimal(res, result);
}

void add_long(long_decimal val_1, long_decimal val_2, long_decimal *result) {
  if (get_sign(val_1) != get_sign(val_2)) {
    if (get_sign(val_2) == 1) {
      set_sign(&val_2, 0);
      sub_long(val_1, val_2, result);
    } else if (get_sign(val_1) == 1) {
      set_sign(&val_1, 0);
      sub_long(val_2, val_1, result);
    }
  } else {
    to_same_exp(&val_1, &val_2);
    int ost = 0;
    long mod = 1l << 32;
    for (int i = 0; i < 6; i++) {
      long sum = (long)val_1.bits[i] + (long)val_2.bits[i] + ost;
      ost = sum / mod;
      result->bits[i] = sum % mod;
    }
    set_exp(result, get_exp(val_1));
    set_sign(result, get_sign(val_1));
  }
}
