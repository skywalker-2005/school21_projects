#include "s21_basic_str_funcs.h"

void *s21_memset(void *str, int c, s21_size_t n) {
  unsigned char *byte = str;
  while (n--) {
    *byte++ = (unsigned char)c;
  }
  return str;
}