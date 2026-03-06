#include "s21_matrix.h"

int s21_mult_number(matrix_t *A, double number, matrix_t *result) {
  if (result) {
    result->matrix = NULL;
    result->rows = 0;
    result->columns = 0;
  }

  int flagA = check_conditions(A);
  int flag = 0;

  if (result != NULL && flagA == 0) {
    if (s21_create_matrix(A->rows, A->columns, result) != 0) {
      flag = 1;
    } else {
      for (int i = 0; i < A->rows; i++) {
        for (int j = 0; j < A->columns; j++) {
          result->matrix[i][j] = A->matrix[i][j] * number;
        }
      }
    }
  } else {
    flag = 1;
  }
  return flag;
}
