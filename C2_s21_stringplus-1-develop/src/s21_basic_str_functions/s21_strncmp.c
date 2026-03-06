#include "s21_basic_str_funcs.h"
int s21_strncmp(const char *str1, const char *str2, s21_size_t n) {
  const unsigned char *byte_str1 = (const unsigned char *)str1;
  const unsigned char *byte_str2 = (const unsigned char *)str2;

  for (s21_size_t i = 0; i < n; i++) {
    if (byte_str1[i] != byte_str2[i] || byte_str1[i] == '\0' ||
        byte_str2[i] == '\0')
      return (int)byte_str1[i] - (int)byte_str2[i];
  }
  return 0;
}