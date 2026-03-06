#include "s21_sprintf.h"

#include "../common/s21_list.h"
#include "../s21_basic_str_functions/s21_basic_str_funcs.h"

typedef struct {
  bool leftAlign;
  bool plusSign;
  bool spaceSign;
  bool zeroSpaces;
  s21_size_t width;
  int precision;
  char length;
  char specifier;
} FormatSpec;

void _castSignedIntWithLength(long long *num, char length) {
  if (length == 'h')
    *num = (long long)((short)*num);
  else if (length != 'l')
    *num = (long long)((int)*num);
}

void _castUnsignedIntWithLength(unsigned long long *num, char length) {
  if (length == 'h')
    *num = (unsigned long long)((unsigned short)*num);
  else if (length != 'l')
    *num = (unsigned long long)((unsigned int)*num);
}

s21_size_t _applyWidth(char **buffer, FormatSpec spec,
                       s21_size_t charsWritten) {
  s21_size_t addedSpaces = 0;
  char symbol = spec.zeroSpaces && !spec.leftAlign &&
                        (spec.specifier == 'i' || spec.specifier == 'd' ||
                         spec.specifier == 'u' || spec.specifier == 'f')
                    ? '0'
                    : ' ';

  if (charsWritten < spec.width) {
    s21_size_t spacesToAdd = spec.width - charsWritten;

    for (s21_size_t i = 0; i < spacesToAdd; i++) {
      **buffer = symbol;
      (*buffer)++;
      addedSpaces++;
    }
  }

  return addedSpaces;
}

char _handleSign(long long *num, FormatSpec spec) {
  char sign = '\0';

  if (*num >= 0 && spec.plusSign)
    sign = '+';
  else if (*num >= 0 && spec.spaceSign)
    sign = ' ';

  if (*num < 0) {
    sign = '-';
    *num = -1 * *num;
  }

  return sign;
}

void _writeNumToBuffer(char **buffer, node *list, FormatSpec spec) {
  char sign = *((char *)(list->data));
  s21_size_t charsToWrite = len(list);

  if (spec.zeroSpaces && (sign == '+' || sign == '-' || sign == ' ')) {
    **buffer = sign;
    ++*buffer;
    list = list->next;
  }

  if (!spec.leftAlign && spec.width) _applyWidth(buffer, spec, charsToWrite);

  for (node *current = list; current; current = current->next) {
    **buffer = *((char *)(current->data));
    ++*buffer;
  }

  if (spec.leftAlign && spec.width) _applyWidth(buffer, spec, charsToWrite);
}

void _wrtiteStrToBuffer(char **buffer, char *str, FormatSpec spec) {
  s21_size_t charsToWrite =
      spec.precision != -1 && (s21_size_t)spec.precision < s21_strlen(str)
          ? (s21_size_t)spec.precision
          : s21_strlen(str);

  if (!spec.leftAlign && spec.width) _applyWidth(buffer, spec, charsToWrite);

  for (s21_size_t i = 0; i < charsToWrite; i++) {
    **buffer = str[i];
    ++*buffer;
  }

  if (spec.leftAlign && spec.width) _applyWidth(buffer, spec, charsToWrite);
}

double _roundToPrecision(double num, int precision) {
  double factor = pow(10, precision);
  double epsilon = 1e-8;
  double scaled = (num * factor + (num < 0 ? -epsilon : epsilon));
  return (round(scaled) + (num < 0 ? -epsilon : epsilon)) / factor;
  // if (num < 0) return ceil(num * factor - 0.5) / factor;
  // return floor(num * factor + 0.5) / factor;
}

node *_uintToList(void *numPtr, FormatSpec spec) {
  unsigned long long num = *(unsigned long long *)numPtr;
  _castUnsignedIntWithLength(&num, spec.length);
  node *numAsChars = NULL;

  do {
    char temp = num % 10 + 48;
    insert(&numAsChars, &temp, 1UL, 0);
    num /= 10;
  } while (num > 0);

  int zeroesToAdd = spec.precision - (int)len(numAsChars);
  while (zeroesToAdd > 0 && spec.specifier != 'f') {
    char temp = '0';
    insert(&numAsChars, &temp, 1UL, 0);
    zeroesToAdd--;
  }

  return numAsChars;
}

node *_intToList(void *numPtr, FormatSpec spec) {
  long long num = *(long long *)numPtr;
  _castSignedIntWithLength(&num, spec.length);

  char sign = _handleSign(&num, spec);
  node *numAsChars = _uintToList(&num, spec);

  if (sign) insert(&numAsChars, &sign, 1UL, 0);

  return numAsChars;
}

node *_floatToList(void *numPtr, FormatSpec spec) {
  double num = *(double *)numPtr;
  int precision = spec.precision == -1 ? 6 : spec.precision;
  num = _roundToPrecision(num, precision);

  long long intPart = (long long)num;
  char sign = _handleSign(&intPart, spec);
  node *numAsChars = _uintToList(&intPart, spec);
  if (sign) insert(&numAsChars, &sign, 1UL, 0);

  if (num < 0) num *= -1;
  double fracPart = num - (double)intPart;

  if (fracPart && spec.precision) {
    char temp = '.';
    append(&numAsChars, &temp, 1UL);
  }

  for (int i = 0; i < precision; i++) {
    fracPart *= 10.0;
    int digit = (int)fracPart;
    char temp = digit + 48;
    append(&numAsChars, &temp, 1UL);
    fracPart -= digit;
  }

  return numAsChars;
}

void _handleNumeric(node *(*func)(void *, FormatSpec), void *numPtr,
                    FormatSpec spec, char **bufPtr) {
  node *numAsList = func(numPtr, spec);
  _writeNumToBuffer(bufPtr, numAsList, spec);
  destroy(numAsList, NULL);
}

void _handleString(char **bufPtr, va_list *args, FormatSpec spec) {
  if (spec.length != 'l') {
    char *str = va_arg(*args, char *);
    _wrtiteStrToBuffer(bufPtr, str, spec);
  } else {
    wchar_t *wstr = va_arg(*args, wchar_t *);
    char str[wcslen(wstr) * 4];
    wcstombs(str, wstr, sizeof(str));
    _wrtiteStrToBuffer(bufPtr, str, spec);
  }
}

void _handleChar(char **bufPtr, va_list *args, FormatSpec spec) {
  s21_size_t charsToWrite = 1;
  if (!spec.leftAlign && spec.width) _applyWidth(bufPtr, spec, charsToWrite);

  if (spec.length != 'l') {
    **bufPtr = (char)va_arg(*args, unsigned int);
    ++*bufPtr;
  } else {
    *bufPtr += wctomb(*bufPtr, va_arg(*args, wchar_t));
  }

  if (spec.leftAlign && spec.width) _applyWidth(bufPtr, spec, charsToWrite);
}
void _parseFlags(const char **fmt_ptr, FormatSpec *spec) {
  while (**fmt_ptr == '-' || **fmt_ptr == '+' || **fmt_ptr == ' ' ||
         **fmt_ptr == '0') {
    if (**fmt_ptr == '-') spec->leftAlign = true;
    if (**fmt_ptr == '+') spec->plusSign = true;
    if (**fmt_ptr == ' ') spec->spaceSign = true;
    if (**fmt_ptr == '0') spec->zeroSpaces = true;

    ++*fmt_ptr;
  }
}

void _parseWidth(const char **fmt_ptr, FormatSpec *spec) {
  while (**fmt_ptr >= '0' && **fmt_ptr <= '9') {
    spec->width = spec->width * 10 + (**fmt_ptr - '0');
    ++*fmt_ptr;
  }
}

void _parseLenght(const char **fmt_ptr, FormatSpec *spec) {
  if (**fmt_ptr == 'h' || **fmt_ptr == 'l') {
    spec->length = **fmt_ptr;
    ++*fmt_ptr;
  }
}

void _parsePrecision(const char **fmt_ptr, FormatSpec *spec) {
  int precision = -1;

  if (**fmt_ptr == '.') {
    ++*fmt_ptr;
    precision = 0;

    while (**fmt_ptr >= '0' && **fmt_ptr <= '9') {
      precision = precision * 10 + (**fmt_ptr - 48);
      ++*fmt_ptr;
    }
  }

  spec->precision = precision;
}

FormatSpec _parseSpec(const char **fmt_ptr) {
  FormatSpec spec = {};

  _parseFlags(fmt_ptr, &spec);
  _parseWidth(fmt_ptr, &spec);
  _parsePrecision(fmt_ptr, &spec);
  _parseLenght(fmt_ptr, &spec);
  spec.specifier = **fmt_ptr;

  return spec;
}

int s21_sprintf(char *buffer, const char *format, ...) {
  va_list args;
  va_start(args, format);

  char *buf_ptr = buffer;

  for (const char *fmt_ptr = format; *fmt_ptr; ++fmt_ptr) {
    if (*fmt_ptr == '%') {
      ++fmt_ptr;
      FormatSpec spec = _parseSpec(&fmt_ptr);

      switch (spec.specifier) {
        case 'i':
        case 'd': {
          long long temp = va_arg(args, long long);
          _handleNumeric(_intToList, &temp, spec, &buf_ptr);
          break;
        }
        case 'u': {
          unsigned long long temp = va_arg(args, unsigned long long);
          _handleNumeric(_uintToList, &temp, spec, &buf_ptr);
          break;
        }
        case 'f': {
          double temp = va_arg(args, double);
          _handleNumeric(_floatToList, &temp, spec, &buf_ptr);
          break;
        }
        case 's':
          _handleString(&buf_ptr, &args, spec);
          break;

        case 'c':
          _handleChar(&buf_ptr, &args, spec);
          break;

        case '%':
          *buf_ptr++ = *fmt_ptr;
          break;

        default: {
          *buf_ptr++ = '%';
          *buf_ptr++ = *fmt_ptr;
          break;
        }
      }
    } else {
      *buf_ptr++ = *fmt_ptr;
    }
  }

  *buf_ptr = '\0';
  va_end(args);

  return buf_ptr - buffer;
}