#include "s21_basic_str_funcs.h"

char *s21_strpbrk(const char *str1, const char *str2) {
  while (*str1) {
    const char *s2 = str2;
    while (*s2) {
      if (*str1 == *s2) return (char *)str1;

      s2++;
    }
    str1++;
  }
  return S21_NULL;
}