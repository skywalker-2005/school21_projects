#include "s21_matrix.h"

static void mult_matrix_fill_row(matrix_t *A, matrix_t *B, matrix_t *result,
                                 int i) {
  for (int j = 0; j < B->columns; j++) {
    result->matrix[i][j] = 0.0;
    for (int k = 0; k < A->columns; k++) {
      result->matrix[i][j] += A->matrix[i][k] * B->matrix[k][j];
    }
  }
}

int s21_mult_matrix(matrix_t *A, matrix_t *B, matrix_t *result) {
  if (result) {
    result->matrix = NULL;
    result->rows = 0;
    result->columns = 0;
  }

  int flagA = check_conditions(A);
  int flagB = check_conditions(B);

  int flag = 0;
  if (flagA != 0 || flagB != 0) {
    flag = 1;
  } else if (A->columns != B->rows) {
    flag = 2;
  } else if (result != NULL) {
    if (s21_create_matrix(A->rows, B->columns, result) != 0) {
      flag = 1;
    }
    if (flag == 0) {
      for (int i = 0; i < A->rows; i++) {
        mult_matrix_fill_row(A, B, result, i);
      }
    }
  } else {
    flag = 1;
  }
  return flag;
}
