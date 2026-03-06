#include "s21_matrix.h"

static int build_minor(matrix_t *A, int n, int ex_i, int ex_j,
                       matrix_t *minor) {
  int code = s21_create_matrix(n - 1, n - 1, minor);
  if (code != 0) return code;

  int minor_i = 0;
  for (int row = 0; row < n; row++) {
    if (row == ex_i) continue;
    int minor_j = 0;
    for (int col = 0; col < n; col++) {
      if (col == ex_j) continue;
      minor->matrix[minor_i][minor_j] = A->matrix[row][col];
      minor_j++;
    }
    minor_i++;
  }
  return 0;
}

int s21_calc_complements(matrix_t *A, matrix_t *result) {
  int flag = 0;

  if (result) {
    result->matrix = NULL;
    result->rows = 0;
    result->columns = 0;
  }

  if (check_conditions(A) || result == NULL) {
    flag = 1;
  } else if (A->rows != A->columns) {
    flag = 2;
  }

  if (flag != 0) {
    if (result != NULL && result->matrix != NULL) s21_remove_matrix(result);
  } else {
    int n = A->rows;

    if (s21_create_matrix(n, n, result) != 0) {
      flag = 1;
    } else if (n == 1) {
      result->matrix[0][0] = 1.0;
    } else if (n > 1) {
      for (int i = 0; i < n && flag == 0; i++) {
        for (int j = 0; j < n && flag == 0; j++) {
          matrix_t minor = {0};
          if (build_minor(A, n, i, j, &minor) != 0) {
            flag = 1;
            continue;
          }
          double det_minor = 0.0;
          int det_result = s21_determinant(&minor, &det_minor);
          s21_remove_matrix(&minor);
          if (det_result != 0) {
            flag = det_result;
          } else {
            double sign = ((i + j) % 2 == 0) ? 1.0 : -1.0;
            result->matrix[i][j] = sign * det_minor;
          }
        }
      }
    }
  }

  if (flag != 0 && result != NULL && result->matrix != NULL) {
    s21_remove_matrix(result);
  }

  return flag;
}
