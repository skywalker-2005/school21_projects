#ifndef S21_SPRINTF_H
#define S21_SPRINTF_H

#include <math.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <wchar.h>

int s21_sprintf(char *buffer, const char *format, ...)
    __attribute__((format(printf, 2, 3)));

#endif