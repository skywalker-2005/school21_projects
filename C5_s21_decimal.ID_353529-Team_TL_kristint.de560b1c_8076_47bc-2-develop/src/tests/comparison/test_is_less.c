#include "../../s21_test.h"

START_TEST(is_less_test_1) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(10, &value_1);
  s21_from_int_to_decimal(5, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), FALSE);
}
END_TEST

START_TEST(is_less_test_2) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(10, &value_1);
  s21_from_int_to_decimal(10, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), FALSE);
}
END_TEST

START_TEST(is_less_test_3) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(5, &value_1);
  s21_from_int_to_decimal(10, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), TRUE);
}
END_TEST

START_TEST(is_less_test_4) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(-5, &value_1);
  s21_from_int_to_decimal(-10, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), FALSE);
}
END_TEST

START_TEST(is_less_test_5) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(-10, &value_1);
  s21_from_int_to_decimal(-10, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), FALSE);
}
END_TEST

START_TEST(is_less_test_6) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(-10, &value_1);
  s21_from_int_to_decimal(-5, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), TRUE);
}
END_TEST

START_TEST(is_less_test_7) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(10, &value_1);
  s21_from_int_to_decimal(-5, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), FALSE);
}
END_TEST

START_TEST(is_less_test_8) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  s21_from_int_to_decimal(-10, &value_1);
  s21_from_int_to_decimal(5, &value_2);
  ck_assert_int_eq(s21_is_less(value_1, value_2), TRUE);
}
END_TEST

START_TEST(is_less_test_9) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  value_1.bits[3] = 0x80000000;
  value_2.bits[3] = 0x00000000;
  ck_assert_int_eq(s21_is_less(value_1, value_2), FALSE);
}
END_TEST

START_TEST(is_less_test_10) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  value_1.bits[0] = 1000000;
  value_2.bits[0] = 1000000;
  value_1.bits[1] = 1000000;
  value_2.bits[1] = 1000000;
  value_1.bits[2] = 1000000;
  value_2.bits[2] = 500000;
  ck_assert_int_eq(s21_is_less(value_1, value_2), FALSE);
}
END_TEST

START_TEST(is_less_test_11) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  value_1.bits[0] = 1000000;
  value_2.bits[0] = 1000000;
  value_1.bits[1] = 500000;
  value_2.bits[1] = 1000000;
  ck_assert_int_eq(s21_is_less(value_1, value_2), TRUE);
}
END_TEST

START_TEST(is_less_test_12) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  value_1.bits[0] = 500000;
  value_2.bits[0] = 1000000;
  ck_assert_int_eq(s21_is_less(value_1, value_2), TRUE);
}
END_TEST

START_TEST(is_less_test_13) {
  s21_decimal value_1 = {0};
  s21_decimal value_2 = {0};
  value_1.bits[0] = 1000000;
  value_2.bits[0] = 1000000;
  value_1.bits[1] = 1000000;
  value_2.bits[1] = 1000000;
  value_1.bits[2] = 1000000;
  value_2.bits[2] = 500000;
  value_1.bits[3] = 0x80000000;
  value_2.bits[3] = 0x80000000;
  ck_assert_int_eq(s21_is_less(value_1, value_2), TRUE);
}
END_TEST

Suite *test_is_less() {
  Suite *suite = suite_create("is_less");
  TCase *tcase = tcase_create("is_less_tcase");

  tcase_add_test(tcase, is_less_test_1);
  tcase_add_test(tcase, is_less_test_2);
  tcase_add_test(tcase, is_less_test_3);
  tcase_add_test(tcase, is_less_test_4);
  tcase_add_test(tcase, is_less_test_5);
  tcase_add_test(tcase, is_less_test_6);
  tcase_add_test(tcase, is_less_test_7);
  tcase_add_test(tcase, is_less_test_8);
  tcase_add_test(tcase, is_less_test_9);
  tcase_add_test(tcase, is_less_test_10);
  tcase_add_test(tcase, is_less_test_11);
  tcase_add_test(tcase, is_less_test_12);
  tcase_add_test(tcase, is_less_test_13);

  suite_add_tcase(suite, tcase);
  return suite;
}