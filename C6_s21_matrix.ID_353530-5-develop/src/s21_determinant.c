#include "s21_matrix.h"

int s21_determinant(matrix_t *A, double *result) {
  int flag = 0;

  if (check_conditions(A) || result == NULL) {
    flag = 1;
  } else if (A->rows != A->columns) {
    flag = 2;
  }

  if (flag == 0) {
    int n = A->rows;

    if (n == 1) {
      *result = A->matrix[0][0];
    } else if (n > 1) {
      matrix_t complements = {0};
      int comp_result = s21_calc_complements(A, &complements);
      if (comp_result != 0) {
        flag = comp_result;
      } else {
        *result = 0.0;
        for (int j = 0; j < n; j++) {
          *result += A->matrix[0][j] * complements.matrix[0][j];
        }
        s21_remove_matrix(&complements);
      }
    }
  }

  return flag;
}
