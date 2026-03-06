#include "s21_basic_str_funcs.h"

void *s21_memcpy(void *dest, const void *src, s21_size_t n) {
  unsigned char *byte_dest = (unsigned char *)dest;
  const unsigned char *byte_src = (const unsigned char *)src;

  for (s21_size_t i = 0; i < n; i++) {
    byte_dest[i] = byte_src[i];
  }

  return (void *)byte_dest;
}