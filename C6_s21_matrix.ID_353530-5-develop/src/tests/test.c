#include <check.h>
#include <stdio.h>
#include <stdlib.h>

#include "../s21_matrix.h"

#define SUCCESS 1
#define FAILURE 0
#define INCORRECT_MATRIX 1
#define CALC_ERROR 2

// ============================================================
// CREATE MATRIX TESTS
// ============================================================
START_TEST(test_create_valid) {
  matrix_t A = {0};
  int res = s21_create_matrix(3, 4, &A);
  ck_assert_int_eq(res, 0);
  ck_assert_int_eq(A.rows, 3);
  ck_assert_int_eq(A.columns, 4);
  ck_assert_ptr_nonnull(A.matrix);
  s21_remove_matrix(&A);
}
END_TEST

START_TEST(test_create_zero_rows) {
  matrix_t A = {0};
  int res = s21_create_matrix(0, 5, &A);
  ck_assert_int_eq(res, INCORRECT_MATRIX);
}
END_TEST

START_TEST(test_create_negative) {
  matrix_t A = {0};
  int res = s21_create_matrix(-3, 4, &A);
  ck_assert_int_eq(res, INCORRECT_MATRIX);
}
END_TEST

START_TEST(test_create_null_pointer) {
  int res = s21_create_matrix(3, 3, NULL);
  ck_assert_int_eq(res, INCORRECT_MATRIX);
}
END_TEST

// ============================================================
// REMOVE MATRIX TESTS
// ============================================================
START_TEST(test_remove_valid) {
  matrix_t A = {0};
  s21_create_matrix(3, 3, &A);
  s21_remove_matrix(&A);
  ck_assert_ptr_null(A.matrix);
}
END_TEST

START_TEST(test_remove_null) {
  s21_remove_matrix(NULL);  // Не должно крашиться
}
END_TEST

// ============================================================
// EQ MATRIX TESTS
// ============================================================
START_TEST(test_eq_identical) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);
  s21_create_matrix(2, 2, &B);

  A.matrix[0][0] = 1.123456;
  A.matrix[0][1] = 2.654321;
  A.matrix[1][0] = 3.111111;
  A.matrix[1][1] = 4.999999;

  B.matrix[0][0] = 1.123456;
  B.matrix[0][1] = 2.654321;
  B.matrix[1][0] = 3.111111;
  B.matrix[1][1] = 4.999999;

  int res = s21_eq_matrix(&A, &B);
  ck_assert_int_eq(res, SUCCESS);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_eq_different_size) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);
  s21_create_matrix(3, 3, &B);
  int res = s21_eq_matrix(&A, &B);
  ck_assert_int_eq(res, FAILURE);
  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_eq_precision) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(1, 1, &A);
  s21_create_matrix(1, 1, &B);
  A.matrix[0][0] = 1.1234567;
  B.matrix[0][0] = 1.1234568;  // 7-й знак отличается
  int res = s21_eq_matrix(&A, &B);
  ck_assert_int_eq(res, SUCCESS);  // До 6 знаков одинаково
  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_eq_null) {
  matrix_t A = {0};
  s21_create_matrix(2, 2, &A);
  int res = s21_eq_matrix(&A, NULL);
  ck_assert_int_eq(res, FAILURE);
  s21_remove_matrix(&A);
}
END_TEST

// ============================================================
// SUM MATRIX TESTS
// ============================================================
START_TEST(test_sum_valid) {
  matrix_t A = {0}, B = {0}, C = {0};
  s21_create_matrix(2, 2, &A);
  s21_create_matrix(2, 2, &B);

  A.matrix[0][0] = 1.5;
  A.matrix[0][1] = 2.5;
  A.matrix[1][0] = 3.5;
  A.matrix[1][1] = 4.5;

  B.matrix[0][0] = 0.5;
  B.matrix[0][1] = 1.5;
  B.matrix[1][0] = 2.5;
  B.matrix[1][1] = 3.5;

  int res = s21_sum_matrix(&A, &B, &C);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(C.matrix[0][0], 2.0, 1e-6);
  ck_assert_double_eq_tol(C.matrix[1][1], 8.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
  s21_remove_matrix(&C);
}
END_TEST

START_TEST(test_sum_different_size) {
  matrix_t A = {0}, B = {0}, C = {0};
  s21_create_matrix(2, 2, &A);
  s21_create_matrix(3, 3, &B);
  int res = s21_sum_matrix(&A, &B, &C);
  ck_assert_int_eq(res, CALC_ERROR);
  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(menshe_nulya) {
  matrix_t A = {0}, B = {0}, C = {0};
  s21_create_matrix(-2, -2, &A);
  s21_create_matrix(3, -3, &B);
  int res = s21_sum_matrix(&A, &B, &C);
  ck_assert_int_eq(res, 1);
}
END_TEST

// ============================================================
// SUB MATRIX TESTS
// ============================================================
START_TEST(test_sub_valid) {
  matrix_t A = {0}, B = {0}, C = {0};
  s21_create_matrix(2, 2, &A);
  s21_create_matrix(2, 2, &B);

  A.matrix[0][0] = 5.0;
  A.matrix[0][1] = 6.0;
  A.matrix[1][0] = 7.0;
  A.matrix[1][1] = 8.0;

  B.matrix[0][0] = 1.0;
  B.matrix[0][1] = 2.0;
  B.matrix[1][0] = 3.0;
  B.matrix[1][1] = 4.0;

  int res = s21_sub_matrix(&A, &B, &C);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(C.matrix[0][0], 4.0, 1e-6);
  ck_assert_double_eq_tol(C.matrix[1][1], 4.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
  s21_remove_matrix(&C);
}
END_TEST

// ============================================================
// MULT NUMBER TESTS
// ============================================================
START_TEST(test_mult_number_valid) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);

  A.matrix[0][0] = 1.0;
  A.matrix[0][1] = 2.0;
  A.matrix[1][0] = 3.0;
  A.matrix[1][1] = 4.0;

  int res = s21_mult_number(&A, 2.5, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(B.matrix[0][0], 2.5, 1e-6);
  ck_assert_double_eq_tol(B.matrix[1][1], 10.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_mult_number_zero) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);
  A.matrix[0][0] = 5.0;

  int res = s21_mult_number(&A, 0.0, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(B.matrix[0][0], 0.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

// ============================================================
// MULT MATRIX TESTS
// ============================================================
START_TEST(test_mult_matrix_valid) {
  matrix_t A = {0}, B = {0}, C = {0};
  s21_create_matrix(2, 3, &A);
  s21_create_matrix(3, 2, &B);

  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[0][2] = 3;
  A.matrix[1][0] = 4;
  A.matrix[1][1] = 5;
  A.matrix[1][2] = 6;

  B.matrix[0][0] = 1;
  B.matrix[0][1] = 2;
  B.matrix[1][0] = 3;
  B.matrix[1][1] = 4;
  B.matrix[2][0] = 5;
  B.matrix[2][1] = 6;

  int res = s21_mult_matrix(&A, &B, &C);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(C.matrix[0][0], 22.0, 1e-6);
  ck_assert_double_eq_tol(C.matrix[0][1], 28.0, 1e-6);
  ck_assert_double_eq_tol(C.matrix[1][0], 49.0, 1e-6);
  ck_assert_double_eq_tol(C.matrix[1][1], 64.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
  s21_remove_matrix(&C);
}
END_TEST

START_TEST(test_mult_matrix_invalid_size) {
  matrix_t A = {0}, B = {0}, C = {0};
  s21_create_matrix(2, 2, &A);
  s21_create_matrix(3, 2, &B);
  int res = s21_mult_matrix(&A, &B, &C);
  ck_assert_int_eq(res, CALC_ERROR);
  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

// ============================================================
// TRANSPOSE TESTS
// ============================================================
START_TEST(test_transpose_valid) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 3, &A);

  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[0][2] = 3;
  A.matrix[1][0] = 4;
  A.matrix[1][1] = 5;
  A.matrix[1][2] = 6;

  int res = s21_transpose(&A, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_int_eq(B.rows, 3);
  ck_assert_int_eq(B.columns, 2);
  ck_assert_double_eq_tol(B.matrix[0][0], 1.0, 1e-6);
  ck_assert_double_eq_tol(B.matrix[0][1], 4.0, 1e-6);
  ck_assert_double_eq_tol(B.matrix[2][1], 6.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_transpose_square) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);
  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[1][0] = 3;
  A.matrix[1][1] = 4;

  int res = s21_transpose(&A, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(B.matrix[0][1], 3.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

// ============================================================
// DETERMINANT TESTS
// ============================================================
START_TEST(test_determinant_1x1) {
  matrix_t A = {0};
  double det;
  s21_create_matrix(1, 1, &A);
  A.matrix[0][0] = 5.0;

  int res = s21_determinant(&A, &det);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(det, 5.0, 1e-6);
  s21_remove_matrix(&A);
}
END_TEST

START_TEST(test_determinant_2x2) {
  matrix_t A = {0};
  double det;
  s21_create_matrix(2, 2, &A);
  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[1][0] = 3;
  A.matrix[1][1] = 4;

  int res = s21_determinant(&A, &det);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(det, -2.0, 1e-6);
  s21_remove_matrix(&A);
}
END_TEST

START_TEST(test_determinant_3x3) {
  matrix_t A = {0};
  double det;
  s21_create_matrix(3, 3, &A);
  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[0][2] = 3;
  A.matrix[1][0] = 0;
  A.matrix[1][1] = 4;
  A.matrix[1][2] = 2;
  A.matrix[2][0] = 5;
  A.matrix[2][1] = 2;
  A.matrix[2][2] = 1;

  int res = s21_determinant(&A, &det);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(det, -40.0, 1e-6);
  s21_remove_matrix(&A);
}
END_TEST

START_TEST(test_determinant_not_square) {
  matrix_t A = {0};
  double det;
  s21_create_matrix(2, 3, &A);
  int res = s21_determinant(&A, &det);
  ck_assert_int_eq(res, CALC_ERROR);
  s21_remove_matrix(&A);
}
END_TEST

// ============================================================
// CALC COMPLEMENTS TESTS
// ============================================================
START_TEST(test_complements_2x2) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);
  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[1][0] = 3;
  A.matrix[1][1] = 4;

  int res = s21_calc_complements(&A, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(B.matrix[0][0], 4.0, 1e-6);
  ck_assert_double_eq_tol(B.matrix[0][1], -3.0, 1e-6);
  ck_assert_double_eq_tol(B.matrix[1][0], -2.0, 1e-6);
  ck_assert_double_eq_tol(B.matrix[1][1], 1.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_complements_3x3) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(3, 3, &A);
  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[0][2] = 3;
  A.matrix[1][0] = 0;
  A.matrix[1][1] = 4;
  A.matrix[1][2] = 2;
  A.matrix[2][0] = 5;
  A.matrix[2][1] = 2;
  A.matrix[2][2] = 1;

  int res = s21_calc_complements(&A, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(B.matrix[0][0], 0.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_complements_not_square) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 3, &A);
  int res = s21_calc_complements(&A, &B);
  ck_assert_int_eq(res, CALC_ERROR);
  ck_assert_ptr_null(B.matrix);
  s21_remove_matrix(&A);
}
END_TEST

// ============================================================
// INVERSE MATRIX TESTS
// ============================================================
START_TEST(test_inverse_2x2) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);
  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[1][0] = 3;
  A.matrix[1][1] = 4;

  int res = s21_inverse_matrix(&A, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(B.matrix[0][0], -2.0, 1e-6);
  ck_assert_double_eq_tol(B.matrix[0][1], 1.0, 1e-6);
  ck_assert_double_eq_tol(B.matrix[1][0], 1.5, 1e-6);
  ck_assert_double_eq_tol(B.matrix[1][1], -0.5, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_inverse_3x3) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(3, 3, &A);
  A.matrix[0][0] = 2;
  A.matrix[0][1] = 5;
  A.matrix[0][2] = 7;
  A.matrix[1][0] = 6;
  A.matrix[1][1] = 3;
  A.matrix[1][2] = 4;
  A.matrix[2][0] = 5;
  A.matrix[2][1] = -2;
  A.matrix[2][2] = -3;

  int res = s21_inverse_matrix(&A, &B);
  ck_assert_int_eq(res, 0);
  ck_assert_double_eq_tol(B.matrix[0][0], 1.0, 1e-6);

  s21_remove_matrix(&A);
  s21_remove_matrix(&B);
}
END_TEST

START_TEST(test_inverse_singular) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 2, &A);
  A.matrix[0][0] = 1;
  A.matrix[0][1] = 2;
  A.matrix[1][0] = 2;
  A.matrix[1][1] = 4;
  int res = s21_inverse_matrix(&A, &B);
  ck_assert_int_eq(res, CALC_ERROR);
  ck_assert_ptr_null(B.matrix);
  s21_remove_matrix(&A);
}
END_TEST

START_TEST(test_inverse_not_square) {
  matrix_t A = {0}, B = {0};
  s21_create_matrix(2, 3, &A);
  int res = s21_inverse_matrix(&A, &B);
  ck_assert_int_eq(res, CALC_ERROR);
  ck_assert_ptr_null(B.matrix);
  s21_remove_matrix(&A);
}
END_TEST
// ============================================================
// SUITE CREATION
// ============================================================
Suite *create_suite(void) {
  Suite *s = suite_create("s21_create_matrix");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_create_valid);
  tcase_add_test(tc, test_create_zero_rows);
  tcase_add_test(tc, test_create_negative);
  tcase_add_test(tc, test_create_null_pointer);
  suite_add_tcase(s, tc);
  return s;
}

Suite *remove_suite(void) {
  Suite *s = suite_create("s21_remove_matrix");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_remove_valid);
  tcase_add_test(tc, test_remove_null);
  suite_add_tcase(s, tc);
  return s;
}

Suite *eq_suite(void) {
  Suite *s = suite_create("s21_eq_matrix");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_eq_identical);
  tcase_add_test(tc, test_eq_different_size);
  tcase_add_test(tc, test_eq_precision);
  tcase_add_test(tc, test_eq_null);
  suite_add_tcase(s, tc);
  return s;
}

Suite *sum_suite(void) {
  Suite *s = suite_create("s21_sum_matrix");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_sum_valid);
  tcase_add_test(tc, test_sum_different_size);
  tcase_add_test(tc, menshe_nulya);
  suite_add_tcase(s, tc);
  return s;
}

Suite *sub_suite(void) {
  Suite *s = suite_create("s21_sub_matrix");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_sub_valid);
  suite_add_tcase(s, tc);
  return s;
}

Suite *mult_number_suite(void) {
  Suite *s = suite_create("s21_mult_number");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_mult_number_valid);
  tcase_add_test(tc, test_mult_number_zero);
  suite_add_tcase(s, tc);
  return s;
}

Suite *mult_matrix_suite(void) {
  Suite *s = suite_create("s21_mult_matrix");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_mult_matrix_valid);
  tcase_add_test(tc, test_mult_matrix_invalid_size);
  suite_add_tcase(s, tc);
  return s;
}

Suite *transpose_suite(void) {
  Suite *s = suite_create("s21_transpose");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_transpose_valid);
  tcase_add_test(tc, test_transpose_square);
  suite_add_tcase(s, tc);
  return s;
}

Suite *determinant_suite(void) {
  Suite *s = suite_create("s21_determinant");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_determinant_1x1);
  tcase_add_test(tc, test_determinant_2x2);
  tcase_add_test(tc, test_determinant_3x3);
  tcase_add_test(tc, test_determinant_not_square);
  suite_add_tcase(s, tc);
  return s;
}

Suite *complements_suite(void) {
  Suite *s = suite_create("s21_calc_complements");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_complements_2x2);
  tcase_add_test(tc, test_complements_3x3);
  tcase_add_test(tc, test_complements_not_square);
  suite_add_tcase(s, tc);
  return s;
}

Suite *inverse_suite(void) {
  Suite *s = suite_create("s21_inverse_matrix");
  TCase *tc = tcase_create("Core");
  tcase_add_test(tc, test_inverse_2x2);
  tcase_add_test(tc, test_inverse_3x3);
  tcase_add_test(tc, test_inverse_singular);
  tcase_add_test(tc, test_inverse_not_square);
  suite_add_tcase(s, tc);
  return s;
}

// ============================================================
// MAIN RUNNER
// ============================================================
int main(void) {
  int number_failed = 0;
  SRunner *sr;

  sr = srunner_create(create_suite());
  srunner_add_suite(sr, remove_suite());
  srunner_add_suite(sr, eq_suite());
  srunner_add_suite(sr, sum_suite());
  srunner_add_suite(sr, sub_suite());
  srunner_add_suite(sr, mult_number_suite());
  srunner_add_suite(sr, mult_matrix_suite());
  srunner_add_suite(sr, transpose_suite());
  srunner_add_suite(sr, determinant_suite());
  srunner_add_suite(sr, complements_suite());
  srunner_add_suite(sr, inverse_suite());

  srunner_run_all(sr, CK_NORMAL);
  number_failed = srunner_ntests_failed(sr);
  srunner_free(sr);

  return (number_failed == 0) ? EXIT_SUCCESS : EXIT_FAILURE;
}
