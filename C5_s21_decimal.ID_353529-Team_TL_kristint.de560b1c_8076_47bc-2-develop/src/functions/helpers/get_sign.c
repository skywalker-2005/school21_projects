#include "../../s21_decimal.h"
unsigned int get_sign(long_decimal value) { return value.stuff_bit >> 31; }
