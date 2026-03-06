#include "../s21_decimal.h"

#define D_MIN 1e-28
#define D_MAX 79228162514264337593543950335.0

int get_string_exp(char *str);

int s21_from_float_to_decimal(float src, s21_decimal *dst) {
  long_decimal dst_1 = {};

  int flag = 0, sign = 0;

  if (src < 0.0) {
    sign = 1;
    src *= -1;
  }
  if ((isnan(src)) || (isinf(src)) || (src >= D_MAX) || (src < D_MIN)) {
    flag = 1;
    if (src < D_MIN)
      for (int i = 0; i < 4; i++) dst->bits[i] = 0;
  } else {
    char string[100];
    sprintf(string, "%e", src);
    for (int j = 0; j < 8; j++) {
      if (string[j] != '.') {
        mul_by_ten(&dst_1);
        long_decimal addition = {{string[j] - '0'}, 0};
        add_long(dst_1, addition, &dst_1);
      }
    }
    int exp = get_string_exp(string), normal_exp = 6;

    normal_exp -= exp;
    if (normal_exp < 0) {
      normal_exp *= -1;
      for (int i = 0; i < normal_exp; i++) {
        mul_by_ten(&dst_1);
      }
      normal_exp = 0;
    }
    set_sign(&dst_1, sign);
    set_exp(&dst_1, normal_exp);
    flag = from_long_decimal(dst_1, dst);
  }
  return flag;
}
int get_string_exp(char *str) {
  int result = 0, sign = 0, idx = 0;
  while (str[idx] != 'e') idx++;
  idx++;
  if (str[idx] == '-') sign = 1;
  result = (str[idx + 1] - '0') * 10 + (str[idx + 2] - '0');
  if (sign == 1) result *= -1;
  return result;
}
