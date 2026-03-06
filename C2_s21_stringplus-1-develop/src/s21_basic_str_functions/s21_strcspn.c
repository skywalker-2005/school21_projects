#include "s21_basic_str_funcs.h"

s21_size_t s21_strcspn(const char *str1, const char *str2) {
  const unsigned char *byte_str1 = (const unsigned char *)str1;
  const unsigned char *byte_str2 = (const unsigned char *)str2;
  s21_size_t count = 0;

  while (byte_str1[count] != '\0') {
    bool found = false;
    for (int j = 0; byte_str2[j] != '\0'; j++) {
      if (byte_str1[count] == byte_str2[j]) {
        found = true;
        break;
      }
    }
    if (found) break;

    count++;
  }
  return count;
}