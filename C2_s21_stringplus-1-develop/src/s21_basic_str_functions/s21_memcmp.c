#include "s21_basic_str_funcs.h"

int s21_memcmp(const void *str1, const void *str2, s21_size_t n) {
  const unsigned char *byte1 = (const unsigned char *)str1;
  const unsigned char *byte2 = (const unsigned char *)str2;
  for (s21_size_t i = 0; i < n; i++) {
    if (byte1[i] != byte2[i]) return byte1[i] - byte2[i];
  }
  return 0;
}