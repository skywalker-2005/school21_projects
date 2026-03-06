#include "s21_basic_str_funcs.h"

char *s21_strtok(char *str, const char *delim) {
  static char *saved = S21_NULL;
  char *token = S21_NULL;
  int found = 0;

  if (str != S21_NULL)
    saved = str;
  else if (saved == S21_NULL || *saved == '\0')
    return S21_NULL;

  while (*saved && !found) {
    int not_delim = 1;

    for (const char *i = delim; *i && not_delim; i++)
      if (*saved == *i) not_delim = 0;

    if (not_delim)
      found = 1;
    else
      ++saved;
  }
  found = 0;
  if (*saved) token = saved;

  while (*saved && !found) {
    int not_delim = 1;

    for (const char *i = delim; *i && not_delim; i++)
      if (*saved == *i) not_delim = 0;

    if (not_delim)
      ++saved;
    else
      found = 1;
  }

  if (*saved && found) {
    *saved = '\0';
    ++saved;
  }

  return token;
}

// NEEDS TO BE CHECKED