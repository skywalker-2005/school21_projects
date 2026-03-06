#include "s21_matrix.h"

int check_conditions(matrix_t *mtrx) {
  int flag = 0;

  if (mtrx == NULL) {
    flag = 1;
  } else {
    double **matrix = mtrx->matrix;
    int rows = mtrx->rows;
    int columns = mtrx->columns;

    if (matrix == NULL && rows == 0 && columns == 0) {
      flag = 1;
    } else if (matrix == NULL || rows <= 0 || columns <= 0) {
      flag = 1;
    } else {
      for (int i = 0; i < rows && flag == 0; i++) {
        if (matrix[i] == NULL) flag = 1;
      }
    }
  }
  return flag;
}
