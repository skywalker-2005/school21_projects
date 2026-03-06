#include "s21_basic_str_funcs.h"
char *s21_strrchr(const char *str, int c) {
  const char *ptr = S21_NULL;
  for (;;) {
    if (*str == (char)c) ptr = str;
    if (*str++ == '\0') return (char *)ptr;
  }
}