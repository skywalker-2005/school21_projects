#include "s21_strerror.h"

void s21_int_to_str(int num, char *str) {
  int i = 0;
  int sign = num;

  if (num < 0) num = -num;

  while (num > 0) {
    // Convert integer digit to character and store
    // it in the str
    str[i++] = num % 10 + '0';
    num /= 10;
  }

  if (sign < 0) str[i++] = '-';

  str[i] = '\0';

  // Reverse the string to get the correct order
  for (int j = 0, k = i - 1; j < k; j++, k--) {
    char temp = str[j];
    str[j] = str[k];
    str[k] = temp;
  }
}

char *s21_strerror(int errnum) {
  static const char *error_messages[] = ERROR_MESSAGES;
  static char unknown_error[50];

  if (errnum >= 0 && errnum <= MAX_ERROR_CODE) {
    const char *msg = error_messages[errnum];
    if (msg != S21_NULL) return (char *)msg;
  }

  const char *prefix = "Unknown error ";
  char num_str[20];
  s21_int_to_str(errnum, num_str);

  int i = 0;
  for (; prefix[i] != '\0'; ++i) {
    unknown_error[i] = prefix[i];
  }

  for (int j = 0; num_str[j] != '\0'; ++j, ++i) {
    unknown_error[i] = num_str[j];
  }

  unknown_error[i] = '\0';
  return unknown_error;
}