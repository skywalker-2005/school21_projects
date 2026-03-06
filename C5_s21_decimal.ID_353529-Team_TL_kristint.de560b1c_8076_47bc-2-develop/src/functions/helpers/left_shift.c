#include "../../s21_decimal.h"
int left_shift(long_decimal *value) {
  int answer = get_bit(*value, 0);
  for (int i = 5; i > 0; i--) {
    value->bits[i] <<= 1;
    value->bits[i] += (value->bits[i - 1] >= (1u << 31));
  }
  value->bits[0] <<= 1;
  return answer;
}
