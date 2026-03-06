#include "s21_basic_str_funcs.h"

char *s21_strncpy(char *dest, const char *src, s21_size_t n) {
  if (dest == S21_NULL || src == S21_NULL) return S21_NULL;

  char *ptr = dest;

  while (*src && n--) {
    *dest = *src;
    dest++;
    src++;
  }

  if (*src == '\0' && n) {
    *dest = '\0';
  }
  return ptr;
}
