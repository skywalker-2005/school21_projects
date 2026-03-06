#include <math.h>

#include "s21_matrix.h"

int s21_inverse_matrix(matrix_t *A, matrix_t *result) {
  int flag = 0;
  matrix_t complements = {0};
  matrix_t adjugate = {0};
  double det_A = 0.0;

  if (result) {
    result->matrix = NULL;
    result->rows = 0;
    result->columns = 0;
  }

  if (!A || !result || check_conditions(A)) {
    flag = 1;
  } else if (A->rows != A->columns) {
    flag = 2;
  } else {
    flag = s21_determinant(A, &det_A);
    if (flag == 0 && fabs(det_A) < 1e-10) flag = 2;
  }

  if (flag == 0) {
    flag = s21_calc_complements(A, &complements);
  }
  if (flag == 0) {
    flag = s21_transpose(&complements, &adjugate);
  }
  s21_remove_matrix(&complements);

  if (flag == 0) {
    flag = s21_mult_number(&adjugate, 1.0 / det_A, result);
  }
  s21_remove_matrix(&adjugate);

  if (flag != 0 && result != NULL && result->matrix != NULL) {
    s21_remove_matrix(result);
    result->matrix = NULL;
    result->rows = 0;
    result->columns = 0;
  }

  return flag;
}
