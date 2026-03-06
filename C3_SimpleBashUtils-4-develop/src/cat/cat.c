#include "cat.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void switch_cat(int argc, char* argv[], int* rez, int* index, int* flag_b,
                int* flag_e, int* flag_n, int* flag_s, int* flag_t,
                int* flag_v);

void process_cat(int* ind_buff, char* buff, FILE* file);
void output_cat(int* ind_buff, char* buff, int flag_b, int flag_e, int flag_n,
                int flag_s, int flag_t, int flag_v);

int main(int argc, char* argv[]) {
  int rez;
  int index;

  int sum_files = 0;
  char buff[10000];
  int ind_buff = 0;

  int flag_b = 0, flag_e = 0, flag_n = 0, flag_s = 0, flag_t = 0, flag_v = 0;
  switch_cat(argc, argv, &rez, &index, &flag_b, &flag_e, &flag_n, &flag_s,
             &flag_t, &flag_v);

  for (int i = 1; i < argc; i++) {
    char first = argv[i][0];
    if (first != '-') {
      FILE* file;
      file = fopen(argv[i], "r");

      if (file != NULL) {
        sum_files++;
        fclose(file);
      }
    }
  }

  for (int i = 1; i < argc; i++) {
    char first = argv[i][0];
    if (first != '-') {
      FILE* file;
      file = fopen(argv[i], "r");

      if (file != NULL) {
        process_cat(&ind_buff, buff, file);
        fclose(file);
      } else {
        printf("чёт хз, такого файла нет\n");
      }
    }
  }

  output_cat(&ind_buff, buff, flag_b, flag_e, flag_n, flag_s, flag_t, flag_v);
}

void switch_cat(int argc, char* argv[], int* rez, int* index, int* flag_b,
                int* flag_e, int* flag_n, int* flag_s, int* flag_t,
                int* flag_v) {
  while ((*rez = getopt_long(argc, argv, short_options, long_options, index)) !=
         -1) {
    switch (*rez) {
      case 'b': {
        *flag_b = 1;
        break;
      };

      case 'e': {
        *flag_e = 1;
        *flag_v = 1;
        break;
      };

      case 'n': {
        *flag_n = 1;
        break;
      };

      case 's': {
        *flag_s = 1;
        break;
      };

      case 't': {
        *flag_t = 1;
        *flag_v = 1;
        break;
      };

      case 'E': {
        *flag_e = 1;
        break;
      };

      case 'T': {
        *flag_t = 1;
        break;
      };

      case 'v': {
        *flag_v = 1;
        break;
      };

      case '?':
      default: {
        printf("found unknown option\n");
        break;
      };
    };
  };
}

void process_cat(int* ind_buff, char* buff, FILE* file) {
  char c;

  while ((c = fgetc(file)) != EOF) {
    buff[(*ind_buff)] = c;
    (*ind_buff)++;
  }
}

void output_cat(int* ind_buff, char* buff, int flag_b, int flag_e, int flag_n,
                int flag_s, int flag_t, int flag_v) {
  char c, prev = buff[0];
  int nn = 1;
  int b = 1;
  buff[(*ind_buff) + 1] = '\0';

  for (int i = 0; i < (*ind_buff); i++) {
    c = buff[i];

    if (flag_s == 1 && c == '\n' && prev == '\n') {
      while (c == '\n') {
        i++;
        prev = c;
        c = buff[i];
      }
      if (flag_n == 1 && flag_b != 1) {
        if (flag_e == 1) {
          printf("%6d\t$\n", nn);
        } else
          printf("%6d\t\n", nn);
        nn++;
      } else if (flag_e == 1) {
        printf("$\n");
      } else
        printf("\n");
    };

    if (c != '\0') {
      if (flag_n == 1 && ((prev == '\n') | (i == 0)) && flag_b != 1) {
        printf("%6d\t", nn);
        nn++;
      };

      if (flag_e == 1 && c == '\n') {
        printf("$");
      };

      if (flag_b == 1 &&
          ((prev == '\n' && c != '\n') | (i == 0 && prev != '\n'))) {
        printf("%6d\t", b);
        b++;
      };

      if (flag_t == 1 && c == '\t') printf("^I");

      if (flag_v == 1 && c != EOF) {
        int int_c = (int)c;
        if (int_c > 127 && int_c < 160) printf("M-^");
        if ((int_c < 32 && c != '\n' && c != '\t') | (int_c == 127))
          printf("^");
        if (((int_c < 32) | (int_c > 126 && int_c < 160)) && c != '\t' &&
            c != '\n') {
          int_c = int_c > 126 ? int_c - 128 + 64 : int_c + 64;
          c = (char)int_c;
        }
      };
      printf("%c", c);
      prev = c;
    }
  }
}
