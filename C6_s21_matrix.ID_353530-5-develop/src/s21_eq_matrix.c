#include <math.h>

#include "s21_matrix.h"
#define EPSILON 1e-6

int s21_eq_matrix(matrix_t *A, matrix_t *B) {
  int flagA = check_conditions(A);
  int flagB = check_conditions(B);
  int flag = FAILURE;

  if (flagA == 0 && flagB == 0 && A->rows == B->rows &&
      A->columns == B->columns) {
    flag = SUCCESS;
    for (int i = 0; i < A->rows; i++) {
      for (int j = 0; j < A->columns; j++) {
        if (fabs(A->matrix[i][j] - B->matrix[i][j]) > EPSILON) {
          flag = FAILURE;
        }
      }
    }
  }
  return flag;
}
