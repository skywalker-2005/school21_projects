#include "s21_matrix.h"

static int allocate_matrix(matrix_t *result, int rows, int columns) {
  int flag = 0;
  result->matrix = calloc(rows, sizeof(double *));
  if (!result->matrix) flag = 1;
  if (flag == 0) {
    for (int i = 0; i < rows; i++) {
      result->matrix[i] = calloc(columns, sizeof(double));
      if (!result->matrix[i]) flag = 1;
    }
  }
  return flag;
}

int s21_create_matrix(int rows, int columns, matrix_t *result) {
  int flag = 0;

  if (result) {
    result->matrix = NULL;
    result->rows = 0;
    result->columns = 0;
  }

  if (!result || rows <= 0 || columns <= 0) {
    flag = 1;
  }

  if (!flag) {
    result->rows = rows;
    result->columns = columns;
    result->matrix = NULL;
    flag = allocate_matrix(result, rows, columns);
    if (flag != 0) {
      s21_remove_matrix(result);
    }
  }

  return flag;
}
