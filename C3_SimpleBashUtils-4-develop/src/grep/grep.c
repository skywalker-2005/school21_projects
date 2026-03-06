#include "grep.h"

#include <regex.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int switch_grep(int argc, char* argv[], int* rez, int* index, int* flag_e,
                int* flag_i, int* flag_v, int* flag_c, int* flag_l, int* flag_n,
                int* flag_h, int* flag_s, int* flag_f, int* flag_o);

int process_grep(int count_flags_all, int cnt_pat, int count_files,
                 char* file_name, char** patterns, regex_t* regex, FILE* file,
                 int argc, int flag_e, int flag_i, int flag_v, int flag_c,
                 int flag_l, int flag_n, int flag_h, int flag_s, int flag_f,
                 int flag_o);

void flag_check(int* file_check, int count_flags_all, char* line, int* def_f,
                int schet, regex_t* reg_buff_f, int* strike, int* sovp_l,
                int stroke, int* flag_check_line, int cnt_pat, int count_files,
                char* file_name, char** patterns, regex_t* regex, int argc,
                int flag_e, int flag_i, int flag_v, int flag_c, int flag_l,
                int flag_n, int flag_h, int flag_s, int flag_f, int flag_o);

int read_f_v(char** pat_f, int cnt_pat, regex_t* reg_buff_f, int flag_f,
             int flag_v, char** patterns, int* schet, int* def_f);

int main(int argc, char* argv[]) {
  if (argc >= 3) {
    int rez;
    int index;
    char* patterns[5000];
    regex_t regex[1000];

    int count_files = 0;
    int count_flags_e = 0;
    int count_flags_f = 0;
    int count_flags_all = 0;
    int flagg = 0;

    int flag_e = 0, flag_i = 0, flag_v = 0, flag_c = 0, flag_l = 0, flag_n = 0,
        flag_h = 0, flag_s = 0, flag_f = 0, flag_o = 0;

    flagg = switch_grep(argc, argv, &rez, &index, &flag_e, &flag_i, &flag_v,
                        &flag_c, &flag_l, &flag_n, &flag_h, &flag_s, &flag_f,
                        &flag_o);

    for (int i = 0; i < argc; i++) {
      char fi = argv[i][0];

      if (strcmp(argv[i], "-e") == 0 || strcmp(argv[i], "--regexp=") == 0) {
        count_flags_e++;
        count_files--;
      }

      if (strcmp(argv[i], "-f") == 0 || strcmp(argv[i], "--file=") == 0) {
        count_flags_f++;
        count_files--;
      }

      if (fi != '-' && i != 0) {
        count_files++;
      }

      if (fi == '-') {
        count_flags_all++;
      }
    }
    if (((flag_i == 1) | (flag_v == 1) | (flag_c == 1) | (flag_l == 1) |
         (flag_n == 1) | (flag_h == 1) | (flag_s == 1) | (flag_o == 1)) &&
        (flag_e != 1 && flag_f != 1)) {
      count_files--;
    }
    if (count_flags_all == 0) {
      count_files--;
    }

    int index_expr = 0;

    for (int i = 0; i < argc - count_files; i++) {
      char first = argv[i][0];

      if (first != '-' && i != 0) {
        int ret = regcomp(&regex[index_expr], argv[i], REG_EXTENDED);
        patterns[index_expr] = argv[i];
        index_expr++;

        if (ret != 0) {
          printf("не сработал regex эххххх");
          flagg = 1;
        }
      }
    }

    for (int i = argc - count_files; i < argc; i++) {
      if (flagg == 0) {
        FILE* file;
        file = fopen(argv[i], "r");

        if (file != NULL) {
          int result = process_grep(count_flags_all, index_expr, count_files,
                                    argv[i], patterns, regex, file, argc,
                                    flag_e, flag_i, flag_v, flag_c, flag_l,
                                    flag_n, flag_h, flag_s, flag_f, flag_o);
          if (result == -1) flagg = 1;
          fclose(file);
        } else {
          printf("эмммм, %s ?? чёт хз, такого файла нету\n", argv[i]);
          flagg = 1;
        }
      }
    }

    for (int i = 0; i < index_expr; i++) {
      regfree(&regex[i]);
    }

    if (flagg == 0) {
      return 0;
    } else {
      return -1;
    }
  }
}

int switch_grep(int argc, char* argv[], int* rez, int* index, int* flag_e,
                int* flag_i, int* flag_v, int* flag_c, int* flag_l, int* flag_n,
                int* flag_h, int* flag_s, int* flag_f, int* flag_o) {
  int flag = 0;
  while ((*rez = getopt_long(argc, argv, short_options, long_options, index)) !=
         -1) {
    switch (*rez) {
      case 'e': {
        *flag_e = 1;
        break;
      };

      case 'i': {
        *flag_i = 1;
        break;
      };

      case 'v': {
        *flag_v = 1;
        break;
      };

      case 'c': {
        *flag_c = 1;
        break;
      };

      case 'l': {
        *flag_l = 1;
        break;
      };

      case 'n': {
        *flag_n = 1;
        break;
      };

      case 'h': {
        *flag_h = 1;
        break;
      };

      case 's': {
        *flag_s = 1;
        break;
      };

      case 'f': {
        *flag_f = 1;
        break;
      };

      case 'o': {
        *flag_o = 1;
        break;
      };

      case '?':
      default: {
        printf("эм че за флаг??\n");
        flag = 1;
        break;
      };
    };
  };
  return flag;
}

int process_grep(int count_flags_all, int cnt_pat, int count_files,
                 char* file_name, char** patterns, regex_t* regex, FILE* file,
                 int argc, int flag_e, int flag_i, int flag_v, int flag_c,
                 int flag_l, int flag_n, int flag_h, int flag_s, int flag_f,
                 int flag_o) {
  char* line = NULL;
  size_t size = 0;

  int strike = 0;
  int stroke = 1;
  int sovp_l = 0;
  int def_f = 0;
  char last_sym;
  int file_check = 0;

  regex_t reg_buff_f[1000];
  char* pat_f[5000];
  int schet = 0;  // количество строк в общем файле
  int flag_f_check = 0;

  flag_f_check =
      read_f_v(pat_f, cnt_pat, reg_buff_f, flag_f, flag_v, patterns, &schet,
               &def_f);  // счёт флагов f v

  if (flag_f_check != -1) {
    while (getline(&line, &size, file) != -1) {
      int line_size = strlen(line);
      int flag_check_line = 0;
      // проверка флагов и вывод всег кроме строки
      flag_check(&file_check, count_flags_all, line, &def_f, schet, reg_buff_f,
                 &strike, &sovp_l, stroke, &flag_check_line, cnt_pat,
                 count_files, file_name, patterns, regex, argc, flag_e, flag_i,
                 flag_v, flag_c, flag_l, flag_n, flag_h, flag_s, flag_f,
                 flag_o);

      // после проверки одной строки на все паттерны
      if (flag_check_line == 1 && flag_c != 1 && flag_l != 1 && flag_o != 1 &&
          count_flags_all != 0) {
        if (count_files > 1 && flag_n != 1 && flag_h != 1) {
          printf("%s:%s", file_name, line);
        } else
          printf("%s", line);

        file_check++;
        last_sym = line[line_size - 1];
      }
      stroke++;
    }

    for (int i = 0; i < schet; i++) {
      regfree(&reg_buff_f[i]);
    }

    free(line);

    // обработка поckе чтения всех строк в файле

    if (count_flags_all != 0) {
      if (flag_c == 1 && flag_l != 1) {
        if (count_files > 1)
          printf("%s:%d\n", file_name, strike);
        else
          printf("%d\n", strike);
      } else if (flag_l == 1 && sovp_l == 1)
        printf("%s\n", file_name);
      else if (count_files > 1 && last_sym != '\n' && file_check > 1) {
        printf("\n");
        last_sym = '\n';
      } else if (last_sym != '\n' && flag_o != 1 && file_check > 0) {
        printf("\n");
        last_sym = '\n';
      }
    }
  }

  if (flag_f_check == -1) {
    return -1;
  } else {
    return file_check;
  }
}

void flag_check(int* file_check, int count_flags_all, char* line, int* def_f,
                int schet, regex_t* reg_buff_f, int* strike, int* sovp_l,
                int stroke, int* flag_check_line, int cnt_pat, int count_files,
                char* file_name, char** patterns, regex_t* regex, int argc,
                int flag_e, int flag_i, int flag_v, int flag_c, int flag_l,
                int flag_n, int flag_h, int flag_s, int flag_f, int flag_o) {
  for (int i = 0; i < cnt_pat; i++) {
    int reg = regexec(&regex[i], line, 0, NULL, 0);
    if (flag_e == 1 && flag_o != 1) {
      if (reg == *def_f) {
        *flag_check_line = 1;
      }
    }

    if (flag_f == 1) {
      for (int i = 0; i < schet; i++) {
        int reg = regexec(&reg_buff_f[i], line, 0, NULL, 0);
        if (reg == *def_f) {
          *flag_check_line = 1;
        }
      }
    }

    if (flag_c == 1 && reg == *def_f) {
      *flag_check_line = 1;
      (*strike)++;
    }

    if (flag_i == 1) {
      regex_t regex_2;
      regcomp(&regex_2, patterns[i], REG_ICASE);
      int reg = regexec(&regex_2, line, 0, NULL, 0);
      if (reg == *def_f) {
        *flag_check_line = 1;
      }
      regfree(&regex_2);
    }

    if (flag_v == 1 && flag_l != 1 && reg == *def_f &&
        argc - cnt_pat - count_files - 1 == 1) {
      *flag_check_line = 1;
    }

    if (flag_l == 1 && *sovp_l != 1 && reg == *def_f) {
      *sovp_l = 1;
      *flag_check_line = 1;
    }

    if (flag_n == 1 && reg == *def_f && flag_o != 1 && flag_l != 1 &&
        flag_c != 1) {
      if (count_files > 1)
        printf("%s:%d:", file_name, stroke);
      else
        printf("%d:", stroke);
      *flag_check_line = 1;
    }

    if (((flag_h == 1) | (flag_s == 1)) && reg == *def_f) {
      *flag_check_line = 1;
    }

    if (flag_o == 1 && flag_l != 1 && flag_c != 1) {
      int size = strlen(line);
      for (int inlinee = 0; inlinee < size; inlinee++) {
        int reg = regexec(&regex[i], &line[inlinee], 0, NULL, 0);
        if (reg == *def_f && patterns[i][0] == line[inlinee]) {
          if (count_files > 1 && flag_n != 1)
            printf("%s:%s\n", file_name, patterns[i]);
          else if (flag_n == 1 && count_files > 1)
            printf("%s:%d:%s\n", file_name, stroke, patterns[i]);
          else if (flag_n == 1 && count_files < 2)
            printf("%d:%s\n", stroke, patterns[i]);
          else
            printf("%s\n", patterns[i]);
        }
      }
    }

    if (count_flags_all == 0) {
      if (reg == *def_f) {
        int last = line[strlen(line) - 1];
        if (count_files > 1)
          printf("%s:%s", file_name, line);
        else
          printf("%s", line);
        if (last != '\n') printf("\n");
        (*file_check) = 1;
        *flag_check_line = 1;
      }
    }
  }
}

int read_f_v(char** pat_f, int cnt_pat, regex_t* reg_buff_f, int flag_f,
             int flag_v, char** patterns, int* schet, int* def_f) {
  int flag = 0;
  if (flag_f == 1) {
    char* file_line = NULL;
    size_t size_file = 0;

    for (int i = 0; i < cnt_pat; i++) {
      if (flag == 0) {
        FILE* file_f;
        file_f = fopen(patterns[i], "r");

        if (file_f != NULL) {
          while (getline(&file_line, &size_file, file_f) != -1) {
            if (strlen(file_line) != 1) {
              file_line[strlen(file_line) - 1] = '\0';
            }
            regcomp(&reg_buff_f[*schet], file_line, REG_EXTENDED);
            pat_f[*schet] = file_line;
            (*schet)++;
          }
          fclose(file_f);
        } else {
          printf("не могу прочесть файлик с флага эффф\n");
          flag = 1;
        }
      }
    }
    free(file_line);
  }

  if (flag_v == 1) {
    *def_f = REG_NOMATCH;
  }

  if (flag == 1) {
    return -1;
  } else {
    return 0;
  }
}
