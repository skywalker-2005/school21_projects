#include "s21_matrix.h"

int s21_transpose(matrix_t *A, matrix_t *result) {
  if (result) {
    result->matrix = NULL;
    result->rows = 0;
    result->columns = 0;
  }

  int flagA = check_conditions(A);
  int flag = 0;

  if (flagA == 0 && result != NULL) {
    if (s21_create_matrix(A->columns, A->rows, result) != 0) {
      flag = 1;
    } else {
      for (int i = 0; i < A->columns; i++) {
        for (int j = 0; j < A->rows; j++) {
          result->matrix[i][j] = A->matrix[j][i];
        }
      }
    }
  } else {
    flag = 1;
  }
  return flag;
}
