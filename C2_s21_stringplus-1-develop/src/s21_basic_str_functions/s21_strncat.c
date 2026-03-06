#include "s21_basic_str_funcs.h"

char *s21_strncat(char *dest, const char *src, s21_size_t n) {
  char *d_ptr = dest;

  while (*d_ptr != '\0') d_ptr++;

  while (n-- > 0 && *src != '\0') *d_ptr++ = *src++;

  *d_ptr = '\0';

  return dest;
}
