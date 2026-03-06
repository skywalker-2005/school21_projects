#include "s21_basic_str_funcs.h"

char *s21_strstr(const char *haystack, const char *needle) {
  char *c_ptr = S21_NULL;
  const char *sub_ptr = needle;

  while (*haystack && c_ptr == S21_NULL) {
    while (*haystack != *needle && *needle && *haystack) ++haystack;

    const char *s_ptr = haystack + 1;
    int sub_length = 0;
    while (*haystack == *needle && *needle && *haystack) {
      ++haystack;
      ++needle;
      ++sub_length;
    }

    if (*needle == '\0')
      c_ptr = (char *)haystack - sub_length;
    else {
      needle = sub_ptr;
      haystack = s_ptr;
    }
  }

  return c_ptr;
}