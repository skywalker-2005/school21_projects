#include "s21_matrix.h"

void s21_remove_matrix(matrix_t *A) {
  if (A == NULL) return;

  double **matrix = A->matrix;
  int rows = A->rows;
  int columns = A->columns;

  A->matrix = NULL;
  A->rows = 0;
  A->columns = 0;

  if (matrix == NULL || rows <= 0 || columns <= 0) return;

  for (int i = 0; i < rows; i++) {
    if (matrix[i] != NULL) free(matrix[i]);
  }
  free(matrix);
}
