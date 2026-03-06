#include "s21_basic_str_funcs.h"

char *s21_strchr(const char *str, int c) {
  if (str == S21_NULL) return S21_NULL;
  while (*str && *str != (char)c) str++;

  if (*str == (char)c)
    return (char *)str;
  else
    return S21_NULL;
}