#include "s21_matrix.h"

int s21_sub_matrix(matrix_t *A, matrix_t *B, matrix_t *result) {
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
  } else if (A->rows != B->rows || A->columns != B->columns) {
    flag = 2;
  } else if (result != NULL) {
    if (s21_create_matrix(A->rows, A->columns, result) != 0) {
      flag = 1;
    }
    if (flag == 0) {
      for (int i = 0; i < A->rows; i++) {
        for (int j = 0; j < A->columns; j++) {
          result->matrix[i][j] = A->matrix[i][j] - B->matrix[i][j];
        }
      }
    }
  } else {
    flag = 1;
  }
  return flag;
}
