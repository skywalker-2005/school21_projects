#include "s21_basic_str_funcs.h"

s21_size_t s21_strlen(const char *str) {
  if (str == S21_NULL) return 0;
  const char *letter = str;
  while (*letter) {
    letter++;
  }

  return (s21_size_t)(letter - str);
}
