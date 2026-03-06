#include "s21_basic_str_funcs.h"

void *s21_memchr(const void *str, int c, s21_size_t n) {
  const unsigned char *ptr = (const unsigned char *)str;
  unsigned char target = (unsigned char)c;

  for (s21_size_t i = 0; i < n; i++) {
    if (ptr[i] == target) return (void *)(ptr + i);
  }
  return S21_NULL;
}