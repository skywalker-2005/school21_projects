#include <check.h>
#include <errno.h>
#include <string.h>

#include "s21_string.h"

// tests for MEMCHR

START_TEST(memchr_1) {
  char str[] = "Hello, world! This is cool test for our cool project";
  int ch = ' ';
  s21_size_t len = strlen(str);
  ck_assert_ptr_eq(memchr(str, ch, len), s21_memchr(str, ch, len));
}
END_TEST

START_TEST(memchr_2) {
  char str[] = "Hello, world! This is cool test for our cool project";
  int ch = '\0';
  s21_size_t len = strlen(str);
  ck_assert_ptr_eq(memchr(str, ch, len), s21_memchr(str, ch, len));
}
END_TEST

START_TEST(memchr_3) {
  char str[] = "Hello, world! This is cool test for our cool project";
  int ch = 'z';
  s21_size_t len = strlen(str);
  ck_assert_ptr_eq(memchr(str, ch, len), s21_memchr(str, ch, len));
}
END_TEST

START_TEST(memchr_4) {
  char str[] = "";
  int ch = ',';
  s21_size_t len = strlen(str);
  ck_assert_ptr_eq(memchr(str, ch, len), s21_memchr(str, ch, len));
}
END_TEST

START_TEST(memchr_5) {
  char str[] = "Hello, world! This is cool test";
  int ch = 'H';
  s21_size_t len = strlen(str);
  ck_assert_ptr_eq(memchr(str, ch, len), s21_memchr(str, ch, len));
}
END_TEST

START_TEST(memchr_6) {
  char str[] = "Hello, world!";
  int ch = '!';
  s21_size_t len = strlen(str);
  ck_assert_ptr_eq(memchr(str, ch, len), s21_memchr(str, ch, len));
}
END_TEST

START_TEST(memchr_7) {
  char str[] = "Hello\0world! This is cool test for our cool project";
  int ch = 'w';
  s21_size_t len = strlen(str);
  ck_assert_ptr_eq(memchr(str, ch, len), s21_memchr(str, ch, len));
}
END_TEST

Suite *memchr_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("memchr_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, memchr_1);
  tcase_add_test(tc_core, memchr_2);
  tcase_add_test(tc_core, memchr_3);
  tcase_add_test(tc_core, memchr_4);
  tcase_add_test(tc_core, memchr_5);
  tcase_add_test(tc_core, memchr_6);
  tcase_add_test(tc_core, memchr_7);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for memcmp

START_TEST(memcmp_1) {
  char str1[] = "Hello world, this is cool test!";
  char str2[] = "Hello world, this is cool test!";
  s21_size_t len = strlen(str1);

  ck_assert_int_eq(memcmp(str1, str2, len), s21_memcmp(str1, str2, len));
}
END_TEST

START_TEST(memcmp_2) {
  char str1[] = "Hello world, this is cool test!";
  char str2[] = "Hello blin!";
  s21_size_t len = strlen(str1);

  ck_assert_int_eq(memcmp(str1, str2, len), s21_memcmp(str1, str2, len));
}
END_TEST

START_TEST(memcmp_3) {
  char str1[] = "";
  char str2[] = "";
  s21_size_t len = 0;

  ck_assert_int_eq(memcmp(str1, str2, len), s21_memcmp(str1, str2, len));
}
END_TEST

START_TEST(memcmp_4) {
  char str1[] = "Hello world, this is cool test!";
  char str2[] = "Hello world, this is cool test";
  s21_size_t len = strlen(str1);

  ck_assert_int_eq(memcmp(str1, str2, len), s21_memcmp(str1, str2, len));
}
END_TEST

START_TEST(memcmp_5) {
  char str1[] = "Hello world\0this is cool test!";
  char str2[] = "Hello world, this is cool test!";
  s21_size_t len = strlen(str1);

  ck_assert_int_eq(memcmp(str1, str2, len), s21_memcmp(str1, str2, len));
}
END_TEST

START_TEST(memcmp_6) {
  char str1[] = "Hello world, this is cool test!";
  char str2[] = "hello world, this is cool Test!";
  s21_size_t len = strlen(str1);

  ck_assert_int_eq(memcmp(str1, str2, len), s21_memcmp(str1, str2, len));
}
END_TEST

START_TEST(memcmp_7) {
  char str1[] = "";
  char str2[] = "Hello world, this is cool test!";
  s21_size_t len = strlen(str1);

  ck_assert_int_eq(memcmp(str1, str2, len), s21_memcmp(str1, str2, len));
}
END_TEST

Suite *memcmp_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("memcmp_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, memcmp_1);
  tcase_add_test(tc_core, memcmp_2);
  tcase_add_test(tc_core, memcmp_3);
  tcase_add_test(tc_core, memcmp_4);
  tcase_add_test(tc_core, memcmp_5);
  tcase_add_test(tc_core, memcmp_6);
  tcase_add_test(tc_core, memcmp_7);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for memcpy

START_TEST(memcpy_1) {
  char src[] = "Hello, world!";
  char dest[50];
  s21_size_t len = strlen(src) + 1;

  ck_assert_str_eq(s21_memcpy(dest, src, len), memcpy(dest, src, len));
}
END_TEST

START_TEST(memcpy_2) {
  char src[] = "Hello\0world!";
  char dest[50];
  s21_size_t len = strlen(src) + 1;

  ck_assert_str_eq(s21_memcpy(dest, src, len), memcpy(dest, src, len));
}
END_TEST

START_TEST(memcpy_3) {
  char src[] = "Hello, world!";

  s21_size_t len = strlen(src);

  ck_assert_str_eq(s21_memcpy(src, "Hello, world!", len),
                   memcpy(src, "Hello, world!", len));
}
END_TEST

START_TEST(memcpy_4) {
  char src[] = "Hello, world!";
  char dest[50];
  s21_size_t len = strlen(src) + 1;

  ck_assert_str_eq(s21_memcpy(dest, src, len), memcpy(dest, src, len));
}
END_TEST

START_TEST(memcpy_5) {
  char src[] = "Hello, world!";
  char dest[10];
  s21_size_t len = 10;

  ck_assert_str_eq(s21_memcpy(dest, src, len), memcpy(dest, src, len));
}
END_TEST

START_TEST(memcpy_6) {
  char src[10000];
  char dest[10000];

  for (int i = 0; i < 10000; i++) {
    src[i] = i;
  }
  s21_size_t len = 10000;
  ck_assert_str_eq(s21_memcpy(dest, src, len), memcpy(dest, src, len));
}
END_TEST

// START_TEST(memcpy_7) {
//   char src[] = "1234567890";
//   char dest[50];
//   s21_size_t len = 6;

//   ck_assert_str_eq(s21_memcpy(dest, src + 4, len), memcpy(dest, src+4, len));
// }
// END_TEST

Suite *memcpy_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("memcpy_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, memcpy_1);
  tcase_add_test(tc_core, memcpy_2);
  tcase_add_test(tc_core, memcpy_3);
  tcase_add_test(tc_core, memcpy_4);
  tcase_add_test(tc_core, memcpy_5);
  tcase_add_test(tc_core, memcpy_6);
  // tcase_add_test(tc_core, memcpy_7);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for memset

START_TEST(memset_1) {
  int arr[5] = {1, 2, 3, 4, 5};
  size_t size = sizeof(arr);
  ck_assert_str_eq((char *)memset(arr, 0, size),
                   (char *)s21_memset(arr, 0, size));
}
END_TEST

START_TEST(memset_2) {
  char str[] = "Hello";
  size_t size = sizeof(str);
  ck_assert_str_eq((char *)memset(str, '*', size),
                   (char *)s21_memset(str, '*', size));
}
END_TEST

START_TEST(memset_3) {
  float farr[5] = {1.0, 2.0, 3.0, 4.0, 5.0};
  float farr1[5] = {1.0, 2.0, 3.0, 4.0, 5.0};
  float farr2[5] = {1.0, 2.0, 3.0, 4.0, 5.0};

  size_t size = sizeof(farr);
  memset(farr1, 42.0, size);
  memset(farr2, 42.0, size);

  // ck_assert_ptr_eq(memset(farr, 42.0, size),
  //                  s21_memset(farr, 42.0, size));
  ck_assert(memcmp(farr1, farr2, size) == 0);
}
END_TEST

START_TEST(memset_4) {
  int arr[] = {10, 20, 30, 40, 50};
  size_t size = sizeof(arr);
  ck_assert_str_eq((char *)memset(arr, 0, size),
                   (char *)s21_memset(arr, 0, size));
}
END_TEST

START_TEST(memset_5) {
  char str[] = "Test";
  size_t size = sizeof(str);
  ck_assert_str_eq((char *)memset(str, 'X', size),
                   (char *)s21_memset(str, 'X', size));
}
END_TEST

START_TEST(memset_6) {
  float farr[10] = {1.0f};
  size_t size = sizeof(farr);
  ck_assert_str_eq((char *)memset(farr, 0, size),
                   (char *)s21_memset(farr, 0, size));
}
END_TEST

START_TEST(memset_7) {
  int arr[] = {100, 200, 300, 400, 500};
  size_t size = sizeof(arr);
  ck_assert_str_eq((char *)memset(arr, 0, size),
                   (char *)s21_memset(arr, 0, size));
}
END_TEST

START_TEST(memset_8) {
  char str[] = "Hello, World!";
  size_t size = sizeof(str);
  ck_assert_str_eq((char *)memset(str, '*', size),
                   (char *)s21_memset(str, '*', size));
}
END_TEST

START_TEST(memset_9) {
  float farr[5] = {1.0, 2.0, 3.0, 4.0, 5.0};
  float farr1[5] = {1.0, 2.0, 3.0, 4.0, 5.0};
  float farr2[5] = {1.0, 2.0, 3.0, 4.0, 5.0};

  size_t size = sizeof(farr);
  memset(farr1, 42.0, size);
  memset(farr2, 42.0, size);

  ck_assert(memcmp(farr1, farr2, size) == 0);
}
END_TEST

START_TEST(memset_10) {
  int arr[] = {1000, 2000, 3000, 4000, 5000};
  size_t size = sizeof(arr);
  ck_assert_str_eq((char *)memset(arr, 0, size),
                   (char *)s21_memset(arr, 0, size));
}
END_TEST

Suite *memset_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("memset_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, memset_1);
  tcase_add_test(tc_core, memset_2);
  tcase_add_test(tc_core, memset_3);
  tcase_add_test(tc_core, memset_4);
  tcase_add_test(tc_core, memset_5);
  tcase_add_test(tc_core, memset_6);
  tcase_add_test(tc_core, memset_7);
  tcase_add_test(tc_core, memset_8);
  tcase_add_test(tc_core, memset_9);
  tcase_add_test(tc_core, memset_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strchr

START_TEST(strchr_test_1) {
  char str[] = "Hello, World!";
  ck_assert_ptr_eq(strchr(str, 'o'), s21_strchr(str, 'o'));
}
END_TEST

START_TEST(strchr_test_2) {
  char str[] = "Programming";
  ck_assert_ptr_eq(strchr(str, 'g'), s21_strchr(str, 'g'));
}
END_TEST

START_TEST(strchr_test_3) {
  char str[] = "C programming";
  ck_assert_ptr_eq(strchr(str, ' '), s21_strchr(str, ' '));
}
END_TEST

START_TEST(strchr_test_4) {
  char str[] = "No special characters";
  ck_assert_ptr_eq(NULL, s21_strchr(str, '!'));
}
END_TEST

START_TEST(strchr_test_5) {
  char str[] = "Multiple occurrences";
  ck_assert_ptr_eq(strchr(str, 'e'), s21_strchr(str, 'e'));
}
END_TEST

START_TEST(strchr_test_6) {
  char str[] = "";
  ck_assert_ptr_eq(NULL, s21_strchr(str, 'a'));
}
END_TEST

START_TEST(strchr_test_7) {
  char str[] = "Only lowercase letters";
  ck_assert_ptr_eq(strchr(str, 'A'), NULL);
}
END_TEST

START_TEST(strchr_test_8) {
  char str[] = "Special characters: !@#$%^&*()_+{}|<>?[]\\";
  ck_assert_ptr_eq(strchr(str, '?'), s21_strchr(str, '?'));
}
END_TEST

START_TEST(strchr_test_9) {
  char str[] = "First occurrence";
  ck_assert_ptr_eq(strchr(str, 'r'), s21_strchr(str, 'r'));
}
END_TEST

START_TEST(strchr_test_10) {
  char str[] = "Last occurrence";
  ck_assert_ptr_eq(strrchr(str, 'o'), s21_strchr(str, 'o'));
}
END_TEST

Suite *strchr_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strchr_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, strchr_test_1);
  tcase_add_test(tc_core, strchr_test_2);
  tcase_add_test(tc_core, strchr_test_3);
  tcase_add_test(tc_core, strchr_test_4);
  tcase_add_test(tc_core, strchr_test_5);
  tcase_add_test(tc_core, strchr_test_6);
  tcase_add_test(tc_core, strchr_test_7);
  tcase_add_test(tc_core, strchr_test_8);
  tcase_add_test(tc_core, strchr_test_9);
  tcase_add_test(tc_core, strchr_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// test for strcspn

START_TEST(strcspn_test_1) {
  char str[] = "Hello, World!";
  ck_assert_int_eq(strcspn(str, "World"), s21_strcspn(str, "World"));
}
END_TEST

START_TEST(strcspn_test_2) {
  char str[] = "Programming";
  ck_assert_int_eq(strcspn(str, "gram"), s21_strcspn(str, "gram"));
}
END_TEST

START_TEST(strcspn_test_3) {
  char str[] = "C programming";
  ck_assert_int_eq(strcspn(str, "programming"),
                   s21_strcspn(str, "programming"));
}
END_TEST

START_TEST(strcspn_test_4) {
  char str[] = "No! special characters";
  ck_assert_int_eq(strcspn(str, "!@#$%^&*()_+{}|<>?[]\\"),
                   s21_strcspn(str, "!@#$%^&*()_+{}|<>?[]\\"));
}
END_TEST

START_TEST(strcspn_test_5) {
  char str[] = "Multiple occurrences";
  ck_assert_int_eq(strcspn(str, "occurrences"),
                   s21_strcspn(str, "occurrences"));
}
END_TEST

START_TEST(strcspn_test_6) {
  char str[] = "";
  ck_assert_int_eq(strcspn(str, ""), s21_strcspn(str, ""));
}
END_TEST

START_TEST(strcspn_test_7) {
  char str[] = "Only lowercase letters";
  ck_assert_int_eq(strcspn(str, "A"), s21_strcspn(str, "A"));
}
END_TEST

START_TEST(strcspn_test_8) {
  char str[] = "Special characters: !@#$%^&*()_+{}|<>?[]\\";
  ck_assert_int_eq(strcspn(str, "!@#$%^&*()_+{}|<>?[]\\"),
                   s21_strcspn(str, "!@#$%^&*()_+{}|<>?[]\\"));
}
END_TEST

START_TEST(strcspn_test_9) {
  char str[] = "First occurrence";
  ck_assert_int_eq(strcspn(str, "first"), s21_strcspn(str, "first"));
}
END_TEST

START_TEST(strcspn_test_10) {
  char str[] = "Last occurrence";
  ck_assert_int_eq(strcspn(str, "lASt"), s21_strcspn(str, "lASt"));
}
END_TEST

Suite *strcspn_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strcspn_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, strcspn_test_1);
  tcase_add_test(tc_core, strcspn_test_2);
  tcase_add_test(tc_core, strcspn_test_3);
  tcase_add_test(tc_core, strcspn_test_4);
  tcase_add_test(tc_core, strcspn_test_5);
  tcase_add_test(tc_core, strcspn_test_6);
  tcase_add_test(tc_core, strcspn_test_7);
  tcase_add_test(tc_core, strcspn_test_8);
  tcase_add_test(tc_core, strcspn_test_9);
  tcase_add_test(tc_core, strcspn_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strerror

START_TEST(strerror_test_1) {
  ck_assert_str_eq(strerror(EINVAL), s21_strerror(EINVAL));
}
END_TEST

START_TEST(strerror_test_2) {
  ck_assert_str_eq(strerror(EPERM), s21_strerror(EPERM));
}
END_TEST

START_TEST(strerror_test_3) {
  ck_assert_str_eq(strerror(ENOENT), s21_strerror(ENOENT));
}
END_TEST

START_TEST(strerror_test_4) {
  ck_assert_str_eq(strerror(EIO), s21_strerror(EIO));
}
END_TEST

START_TEST(strerror_test_5) {
  ck_assert_str_eq(strerror(EACCES), s21_strerror(EACCES));
}
END_TEST

START_TEST(strerror_test_6) {
  ck_assert_str_eq(strerror(EFAULT), s21_strerror(EFAULT));
}
END_TEST

START_TEST(strerror_test_7) {
  ck_assert_str_eq(strerror(135), s21_strerror(135));
}
END_TEST

Suite *strerror_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strerror_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, strerror_test_1);
  tcase_add_test(tc_core, strerror_test_2);
  tcase_add_test(tc_core, strerror_test_3);
  tcase_add_test(tc_core, strerror_test_4);
  tcase_add_test(tc_core, strerror_test_5);
  tcase_add_test(tc_core, strerror_test_6);
  tcase_add_test(tc_core, strerror_test_7);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strlen

START_TEST(strlen_test_1) {
  char str[] = "Hello, World!";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_2) {
  char str[] = "";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_3) {
  char str[] = "Single character";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_4) {
  char str[] = "Multiple spaces   ";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_5) {
  char str[] = "Null character \0";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_6) {
  char str[] = "Long string with many characters";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_7) {
  char str[] = "Binary data: 01010101";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_8) {
  char str[] = "ASCII characters: A  ~";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_9) {
  char str[] = "Repeating character: aaaaaaaa";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

START_TEST(strlen_test_10) {
  char str[] = "Empty string followed by null: \0\0";
  ck_assert_int_eq(strlen(str), s21_strlen(str));
}
END_TEST

Suite *strlen_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strlen_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, strlen_test_1);
  tcase_add_test(tc_core, strlen_test_2);
  tcase_add_test(tc_core, strlen_test_3);
  tcase_add_test(tc_core, strlen_test_4);
  tcase_add_test(tc_core, strlen_test_5);
  tcase_add_test(tc_core, strlen_test_6);
  tcase_add_test(tc_core, strlen_test_7);
  tcase_add_test(tc_core, strlen_test_8);
  tcase_add_test(tc_core, strlen_test_9);
  tcase_add_test(tc_core, strlen_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strncat

START_TEST(strncat_test_1) {
  char dest[100] = "Hello";
  char src[] = "World";

  int n = sizeof(src);

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_2) {
  char dest[100] = "Hello";
  char src[] = "";

  int n = sizeof(src);

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_3) {
  char dest[100] = "Hello";
  char src[] = "World";

  int n = 0;

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_4) {
  char dest[100] = "Hello";
  char src[] = "World";

  int n = 2;

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_5) {
  char dest[100] = "Hello";
  char src[] = "Wor\0ld";

  int n = sizeof(src);

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_6) {
  char dest[100] = "Hello";
  char src[] = "World";

  int n = 4;

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_7) {
  char dest[100] = "";
  char src[] = "Wor";

  int n = 4;

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_8) {
  char dest[100] = "He139274rllo";
  char src[] = "\0";

  int n = sizeof(src);

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_9) {
  char dest[100] = "";
  char src[] = "";

  int n = sizeof(src);

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

START_TEST(strncat_test_10) {
  char dest[100] = "";
  char src[] = "\t";

  int n = sizeof(src);

  ck_assert_str_eq(strncat(dest, src, n), s21_strncat(dest, src, n));
}
END_TEST

Suite *strncat_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strncat_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, strncat_test_1);
  tcase_add_test(tc_core, strncat_test_2);
  tcase_add_test(tc_core, strncat_test_3);
  tcase_add_test(tc_core, strncat_test_4);
  tcase_add_test(tc_core, strncat_test_5);
  tcase_add_test(tc_core, strncat_test_6);
  tcase_add_test(tc_core, strncat_test_7);
  tcase_add_test(tc_core, strncat_test_8);
  tcase_add_test(tc_core, strncat_test_9);
  tcase_add_test(tc_core, strncat_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strncmp

#include <check.h>
#include <string.h>

START_TEST(s21_strncmp_test_1) {
  char str1[] = "Hello";
  char str2[] = "Hello";
  ck_assert_int_eq(s21_strncmp(str1, str2, 5), strncmp(str1, str2, 5));
}
END_TEST

START_TEST(s21_strncmp_test_2) {
  char str1[] = "Hello";
  char str2[] = "World";
  ck_assert_int_eq(s21_strncmp(str1, str2, 5), strncmp(str1, str2, 5));
}
END_TEST

START_TEST(s21_strncmp_test_3) {
  char str1[] = "Hello";
  char str2[] = "He\0llo World";
  ck_assert_int_eq(s21_strncmp(str1, str2, 5), strncmp(str1, str2, 5));
}
END_TEST

START_TEST(s21_strncmp_test_4) {
  char str1[] = "He\tllo";
  char str2[] = "Hello";
  ck_assert_int_eq(s21_strncmp(str1, str2, 6), strncmp(str1, str2, 6));
}
END_TEST

START_TEST(s21_strncmp_test_5) {
  char str1[] = "";
  char str2[] = "";
  ck_assert_int_eq(s21_strncmp(str1, str2, 0), strncmp(str1, str2, 0));
}
END_TEST

START_TEST(s21_strncmp_test_6) {
  char str1[] = "\0";
  char str2[] = "";
  ck_assert_int_eq(s21_strncmp(str1, str2, 1), strncmp(str1, str2, 1));
}
END_TEST

START_TEST(s21_strncmp_test_7) {
  char str1[] = "Hello";
  char str2[] = "World";
  ck_assert_int_eq(s21_strncmp(str1, str2, 1), strncmp(str1, str2, 1));
}
END_TEST

START_TEST(s21_strncmp_test_8) {
  char str1[] = "Hello";
  char str2[] = "Hello World";
  ck_assert_int_eq(s21_strncmp(str1, str2, 0), strncmp(str1, str2, 0));
}
END_TEST

START_TEST(s21_strncmp_test_9) {
  char str1[] = "Hello";
  char str2[] = "Hello";
  ck_assert_int_eq(s21_strncmp(str1, str2, 6), strncmp(str1, str2, 6));
}
END_TEST

START_TEST(s21_strncmp_test_10) {
  char str1[] = "aaa";
  char str2[] = "";
  ck_assert_int_eq(s21_strncmp(str1, str2, 0), strncmp(str1, str2, 0));
}
END_TEST

Suite *strncmp_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strncmp_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, s21_strncmp_test_1);
  tcase_add_test(tc_core, s21_strncmp_test_6);
  tcase_add_test(tc_core, s21_strncmp_test_2);
  tcase_add_test(tc_core, s21_strncmp_test_7);
  tcase_add_test(tc_core, s21_strncmp_test_3);
  tcase_add_test(tc_core, s21_strncmp_test_8);
  tcase_add_test(tc_core, s21_strncmp_test_4);
  tcase_add_test(tc_core, s21_strncmp_test_9);
  tcase_add_test(tc_core, s21_strncmp_test_5);
  tcase_add_test(tc_core, s21_strncmp_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strncpy

START_TEST(strncpy_test_1) {
  char str1[] = "Hello";
  char result_s21[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
       result_std[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO";

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 3),
                   strncpy(result_std, str1, 3));
}
END_TEST

START_TEST(strncpy_test_2) {
  char str1[] = "\0";
  char result_s21[5], result_std[5];

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 5),
                   strncpy(result_std, str1, 5));
}
END_TEST

START_TEST(strncpy_test_3) {
  char str1[] = "1";
  char result_s21[5], result_std[5];

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 5),
                   strncpy(result_std, str1, 5));
}
END_TEST

START_TEST(strncpy_test_4) {
  char str1[] = "";
  char result_s21[6], result_std[6];

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 6),
                   strncpy(result_std, str1, 6));
}
END_TEST

START_TEST(strncpy_test_5) {
  char str1[] = "\n";
  char result_s21[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
       result_std[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO";

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 1),
                   strncpy(result_std, str1, 1));
}
END_TEST

START_TEST(strncpy_test_6) {
  char str1[] = "1234";
  char result_s21[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
       result_std[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO";

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 5),
                   strncpy(result_std, str1, 5));
}
END_TEST

START_TEST(strncpy_test_7) {
  char str1[] = " ";
  char result_s21[5], result_std[5];

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 5),
                   strncpy(result_std, str1, 5));
}
END_TEST

// START_TEST(strncpy_test_8) {
//   char str1[] = "Hello";
//   char result_s21[5], result_std[5];

//   ck_assert_str_eq(s21_strncpy(result_std, str1, 1),
//                    strncpy(result_s21, str1, 1));
// }
// END_TEST

START_TEST(strncpy_test_9) {
  char str1[] = "\0";
  char result_s21[6], result_std[6];

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 1),
                   strncpy(result_std, str1, 1));
}
END_TEST

START_TEST(strncpy_test_10) {
  char str1[] = "/";
  char result_s21[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
       result_std[] = "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO";

  ck_assert_str_eq(s21_strncpy(result_s21, str1, 1),
                   strncpy(result_std, str1, 1));
}
END_TEST

Suite *strncpy_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strncpy_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, strncpy_test_1);
  tcase_add_test(tc_core, strncpy_test_6);
  tcase_add_test(tc_core, strncpy_test_2);
  tcase_add_test(tc_core, strncpy_test_7);
  tcase_add_test(tc_core, strncpy_test_3);
  // tcase_add_test(tc_core, strncpy_test_8);
  tcase_add_test(tc_core, strncpy_test_4);
  tcase_add_test(tc_core, strncpy_test_9);
  tcase_add_test(tc_core, strncpy_test_5);
  tcase_add_test(tc_core, strncpy_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strpbrk

START_TEST(s21_strpbrk_test_1) {
  char str1[] = "Hello, World!";
  char str2[] = ", ";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_2) {
  char str1[] = "Hello, World!";
  char str2[] = "World";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_3) {
  char str1[] = "Hello, World!";
  char str2[] = "Xyz";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_4) {
  char str1[] = "";
  char str2[] = ", ";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_5) {
  char str1[] = "Hello, World!";
  char str2[] = "hello";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_6) {
  char str1[] = "Hello, World!";
  char str2[] = "wORLD";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_7) {
  char str1[] = "Hello, World!";
  char str2[] = "";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_8) {
  char str1[] = "Hello, World!";
  char str2[] = "hello";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_9) {
  char str1[] = "Hello, World!";
  char str2[] = "\0";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strpbrk_test_10) {
  char str1[] = "Hello, World!";
  char str2[] = "!,.";
  char *result_s21 = s21_strpbrk(str1, str2);
  char *result_std = strpbrk(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

Suite *strpbrk_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strpbrk_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, s21_strpbrk_test_1);
  tcase_add_test(tc_core, s21_strpbrk_test_2);
  tcase_add_test(tc_core, s21_strpbrk_test_3);
  tcase_add_test(tc_core, s21_strpbrk_test_4);
  tcase_add_test(tc_core, s21_strpbrk_test_5);
  tcase_add_test(tc_core, s21_strpbrk_test_6);
  tcase_add_test(tc_core, s21_strpbrk_test_7);
  tcase_add_test(tc_core, s21_strpbrk_test_8);
  tcase_add_test(tc_core, s21_strpbrk_test_9);
  tcase_add_test(tc_core, s21_strpbrk_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strrchr

START_TEST(s21_strrchr_test_1) {
  char str1[] = "Hello, World!";
  char ch = 'l';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_2) {
  char str1[] = "Hello, World!";
  char ch = 'o';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_3) {
  char str1[] = "Hello, World!";
  char ch = 'H';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_4) {
  char str1[] = "Hello, World!";
  char ch = 'z';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_5) {
  char str1[] = "";
  char ch = 'a';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_6) {
  char str1[] = "Hello, World!";
  char ch = ',';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_7) {
  char str1[] = "Hello, World!";
  char ch = 'W';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_8) {
  char str1[] = "Hello, World!";
  char ch = ' ';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_9) {
  char str1[] = "Hello, World!";
  char ch = '\0';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strrchr_test_10) {
  char str1[] = "Hello, World!";
  char ch = 'x';
  char *result_s21 = s21_strrchr(str1, ch);
  char *result_std = strrchr(str1, ch);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

Suite *strrchr_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strrchr_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, s21_strrchr_test_1);
  tcase_add_test(tc_core, s21_strrchr_test_2);
  tcase_add_test(tc_core, s21_strrchr_test_3);
  tcase_add_test(tc_core, s21_strrchr_test_4);
  tcase_add_test(tc_core, s21_strrchr_test_5);
  tcase_add_test(tc_core, s21_strrchr_test_6);
  tcase_add_test(tc_core, s21_strrchr_test_7);
  tcase_add_test(tc_core, s21_strrchr_test_8);
  tcase_add_test(tc_core, s21_strrchr_test_9);
  tcase_add_test(tc_core, s21_strrchr_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strstr

START_TEST(s21_strstr_test_1) {
  char str1[] = "Hello, World!";
  char str2[] = "\0";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_2) {
  char str1[] = "Hello, World!";
  char str2[] = "World";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_3) {
  char str1[] = "Hello, World!";
  char str2[] = "Xyz";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_4) {
  char str1[] = "";
  char str2[] = ", ";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_5) {
  char str1[] = "Hello, World!";
  char str2[] = "hello";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_6) {
  char str1[] = "Hello, World!";
  char str2[] = "WORLD";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_7) {
  char str1[] = "Hello, World!";
  char str2[] = ", ";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_8) {
  char str1[] = "Hello, World!";
  char str2[] = "hello";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_9) {
  char str1[] = "Hello, World!";
  char str2[] = "";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strstr_test_10) {
  char str1[] = "Hello\t World!";
  char str2[] = "lo\t";
  char *result_s21 = s21_strstr(str1, str2);
  char *result_std = strstr(str1, str2);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

Suite *strstr_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strstr_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, s21_strstr_test_1);
  tcase_add_test(tc_core, s21_strstr_test_2);
  tcase_add_test(tc_core, s21_strstr_test_3);
  tcase_add_test(tc_core, s21_strstr_test_4);
  tcase_add_test(tc_core, s21_strstr_test_5);
  tcase_add_test(tc_core, s21_strstr_test_6);
  tcase_add_test(tc_core, s21_strstr_test_7);
  tcase_add_test(tc_core, s21_strstr_test_8);
  tcase_add_test(tc_core, s21_strstr_test_9);
  tcase_add_test(tc_core, s21_strstr_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for strtok

START_TEST(s21_strtok_test_1) {
  char str[] = "Hello, World!";
  char delims[] = ", ";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_2) {
  char str[] = "zddzdzdzdzddzdzdz";
  char delims[] = "z";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_3) {
  char str[] = "Hello, World!";
  char delims[] = " ";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_4) {
  char str[] = "";
  char delims[] = ", ";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_5) {
  char str[] = "a a a a a a             a a  a a a";
  char delims[] = " ";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_6) {
  char str[] = "soooo";
  char delims[] = "\t ";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_7) {
  char str[] = "Hello, World!";
  char delims[] = "\0";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_8) {
  char delims[] = "\t";
  char *result_s21 = s21_strtok("\0", delims);
  char *result_std = strtok("\0", delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_9) {
  char str[] = "!!!!!!!!!!!!!1&&&&&&&!!!!!!!!!!!!1";
  char delims[] = "&";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

START_TEST(s21_strtok_test_10) {
  char str[] = "010101010101010101010";
  char delims[] = "0";
  char *ptr = str;
  char *result_s21 = s21_strtok(ptr, delims);
  char *result_std = strtok(ptr, delims);

  ck_assert_ptr_eq(result_s21, result_std);
}
END_TEST

Suite *strtok_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("strtok_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, s21_strtok_test_1);
  tcase_add_test(tc_core, s21_strtok_test_2);
  tcase_add_test(tc_core, s21_strtok_test_3);
  tcase_add_test(tc_core, s21_strtok_test_4);
  tcase_add_test(tc_core, s21_strtok_test_5);
  tcase_add_test(tc_core, s21_strtok_test_6);
  tcase_add_test(tc_core, s21_strtok_test_7);
  tcase_add_test(tc_core, s21_strtok_test_8);
  tcase_add_test(tc_core, s21_strtok_test_9);
  tcase_add_test(tc_core, s21_strtok_test_10);

  suite_add_tcase(s, tc_core);

  return s;
}

// tests for sprintf

START_TEST(sprintf_test_1) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "Hello");
  sprintf(buff2, "Hello");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_2) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%c", 'H');
  sprintf(buff2, "%c", 'H');
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_3) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%d", 21);
  sprintf(buff2, "%d", 21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_4) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%f", 3.1415);
  sprintf(buff2, "%f", 3.1415);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_5) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%u", 42);
  sprintf(buff2, "%u", 42);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_6) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%c", '\0');
  sprintf(buff2, "%c", '\0');
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_7) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%d", -21);
  sprintf(buff2, "%d", -21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_8) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%.2f", 3.1415);
  sprintf(buff2, "%.2f", 3.1415);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_9) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%u", -42);
  sprintf(buff2, "%u", -42);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_10) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%c %d %f %s %u", 'H', 21, 2.96999, "Hello, world!", 42);
  sprintf(buff2, "%c %d %f %s %u", 'H', 21, 2.96999, "Hello, world!", 42);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_11) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%%");
  sprintf(buff2, "%%");
  ck_assert_str_eq(buff, buff2);
}

START_TEST(sprintf_test_41) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%s", "Hello, world");
  sprintf(buff2, "%s", "Hello, world");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_12) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-c", 'c');
  sprintf(buff2, "%-c", 'c');
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_13) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-d", 21);
  sprintf(buff2, "%-d", 21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_14) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-f", 3.1415);
  sprintf(buff2, "%-f", 3.1415);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_15) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-s", "hello, world!?");
  sprintf(buff2, "%-s", "hello, world!?");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_16) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-u", 42);
  sprintf(buff2, "%-u", 42);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_17) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%ld", 1111112020202002222);
  sprintf(buff2, "%ld", 1111112020202002222);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_18) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%+d", 21);
  sprintf(buff2, "%+d", 21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_19) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%+f", 3.1415);
  sprintf(buff2, "%+f", 3.1415);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_20) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%u", -20);
  sprintf(buff2, "%u", -20);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_21) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "% d", +1);
  sprintf(buff2, "% d", +1);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_22) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-5d", 1111112222);
  sprintf(buff2, "%-5d", 1111112222);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_23) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "% d", 21);
  sprintf(buff2, "% d", 21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_24) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "% f", 3.1415);
  sprintf(buff2, "% f", 3.1415);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_25) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-5c", 'c');
  sprintf(buff2, "%-5c", 'c');
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_26) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-5f", 3.14159);
  sprintf(buff2, "%-5f", 3.14159);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_27) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%1c", 'c');
  sprintf(buff2, "%1c", 'c');
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_28) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%1d", 21);
  sprintf(buff2, "%1d", 21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_29) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%1f", 3.1415);
  sprintf(buff2, "%1f", 3.1415);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_30) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%1s", "hello, world!?");
  sprintf(buff2, "%1s", "hello, world!?");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_31) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%1u", 42);
  sprintf(buff2, "%1u", 42);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_32) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-5s", "3.1419");
  sprintf(buff2, "%-5s", "3.1419");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_33) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%.1d", 21);
  sprintf(buff2, "%.1d", 21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_34) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%.1f", 3.1415);
  sprintf(buff2, "%.1f", 3.1415);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_35) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%.1s", "hello, world!?");
  sprintf(buff2, "%.1s", "hello, world!?");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_36) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%.1u", 42);
  sprintf(buff2, "%.1u", 42);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_37) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%hd", 21);
  sprintf(buff2, "%hd", 21);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_38) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%hu", 42);
  sprintf(buff2, "%hu", 42);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_39) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%ld", 212121424242);
  sprintf(buff2, "%ld", 212121424242);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_40) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%lu", 212121424242);
  sprintf(buff2, "%lu", 212121424242);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_42) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-5u", 02121);
  sprintf(buff2, "%-5u", 02121);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_43) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-.12d", 111002222);
  sprintf(buff2, "%-.12d", 111002222);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_44) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-.5d", 111002222);
  sprintf(buff2, "%-.5d", 111002222);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_45) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-.12f", 3.14);
  sprintf(buff2, "%-.12f", 3.14);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_46) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-.1f", 3.14);
  sprintf(buff2, "%-.1f", 3.14);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_47) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-.1u", 0);
  sprintf(buff2, "%-.1u", 0);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_48) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%+.1d %+.1f % d", 0, 3.18723, +1);
  sprintf(buff2, "%+.1d %+.1f % d", 0, 3.18723, +1);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_49) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%5.2d %5.2u %5.2s", 12, -21, "hellooooooooo");
  sprintf(buff2, "%5.2d %5.2u %5.2s", 12, -21, "hellooooooooo");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_50) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, "%-5.2d %-5.2u %-5.2s", 12, -21, "hellooooooooo");
  sprintf(buff2, "%-5.2d %-5.2u %-5.2s", 12, -21, "hellooooooooo");
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_51) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff,
              "%-2c %-2d %-2f %-2s %-2u %-2c %-2d %-2f %-2s %-2u %-2c %-2d "
              "%-2f %-2s %-2u %-.2d %-.2f %-.2s %-.2u %-2ld %-2hd",
              'c', 1, 3.1, "hello", 1, 'c', 111, 3.111, "h", 111, 'c', 11, 3.11,
              "h", 11, 111, 3.111, "h", 111, 999123456789, 0);
  sprintf(buff2,
          "%-2c %-2d %-2f %-2s %-2u %-2c %-2d %-2f %-2s %-2u %-2c %-2d %-2f "
          "%-2s %-2u %-.2d %-.2f %-.2s %-.2u %-2ld %-2hd",
          'c', 1, 3.1, "hello", 1, 'c', 111, 3.111, "h", 111, 'c', 11, 3.11,
          "h", 11, 111, 3.111, "h", 111, 999123456789, 0);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_52) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, " %+2d %+2f %+2d %+2f %+2d %+2f %+.2d %+.2f %+2hd", 1, 3.11,
              22, 3.1, 11, 3.111, 1, 3.1, 0);
  sprintf(buff2, " %+2d %+2f %+2d %+2f %+2d %+2f %+.2d %+.2f %+2hd", 1, 3.11,
          22, 3.1, 11, 3.111, 1, 3.1, 0);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_53) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff, " % 2d % 2f % 2d % 2f % 2d % 2f % .2d % .2f % 2hd", 1, 3.11,
              22, 3.1, 11, 3.111, 1, 3.1, 0);
  sprintf(buff2, " % 2d % 2f % 2d % 2f % 2d % 2f % .2d % .2f % 2hd", 1, 3.11,
          22, 3.1, 11, 3.111, 1, 3.1, 0);
  ck_assert_str_eq(buff, buff2);
}
END_TEST

START_TEST(sprintf_test_54) {
  char buff[100];
  char buff2[100];
  s21_sprintf(buff,
              " %2.2d %1.2f %3.2d %0.1f %1.0d %3.5f %2.2d %7.7f %5.2hd %2.8ld "
              "% 2.5hd %ls %lc",
              1, 3.11, 22, 3.1, 11, 3.111, 1, 3.1, 0, 348320958209840, 1,
              L"sdfsdfsdf", L'c');
  sprintf(buff2,
          " %2.2d %1.2f %3.2d %0.1f %1.0d %3.5f %2.2d %7.7f %5.2hd %2.8ld % "
          "2.5hd %ls %lc",
          1, 3.11, 22, 3.1, 11, 3.111, 1, 3.1, 0, 348320958209840, 1,
          L"sdfsdfsdf", L'c');
  ck_assert_str_eq(buff, buff2);
}
END_TEST

// START_TEST(sprintf_test_) {
//     char buff[100];
//     char buff2[100];
//     s21_sprintf
//     sprintf
//     ck_assert_str_eq(buff, buff2);
// }
// END_TEST

Suite *sprintf_suite(void) {
  Suite *s;
  TCase *tc_core;

  s = suite_create("sprintf_suite");
  tc_core = tcase_create("Core");

  tcase_add_test(tc_core, sprintf_test_1);
  tcase_add_test(tc_core, sprintf_test_2);
  tcase_add_test(tc_core, sprintf_test_3);
  tcase_add_test(tc_core, sprintf_test_4);
  tcase_add_test(tc_core, sprintf_test_5);
  tcase_add_test(tc_core, sprintf_test_6);
  tcase_add_test(tc_core, sprintf_test_7);
  tcase_add_test(tc_core, sprintf_test_8);
  tcase_add_test(tc_core, sprintf_test_9);
  tcase_add_test(tc_core, sprintf_test_10);
  tcase_add_test(tc_core, sprintf_test_11);
  tcase_add_test(tc_core, sprintf_test_12);
  tcase_add_test(tc_core, sprintf_test_13);
  tcase_add_test(tc_core, sprintf_test_14);
  tcase_add_test(tc_core, sprintf_test_15);
  tcase_add_test(tc_core, sprintf_test_16);
  tcase_add_test(tc_core, sprintf_test_17);
  tcase_add_test(tc_core, sprintf_test_18);
  tcase_add_test(tc_core, sprintf_test_19);
  tcase_add_test(tc_core, sprintf_test_20);
  tcase_add_test(tc_core, sprintf_test_21);
  tcase_add_test(tc_core, sprintf_test_22);
  tcase_add_test(tc_core, sprintf_test_23);
  tcase_add_test(tc_core, sprintf_test_24);
  tcase_add_test(tc_core, sprintf_test_25);
  tcase_add_test(tc_core, sprintf_test_26);
  tcase_add_test(tc_core, sprintf_test_27);
  tcase_add_test(tc_core, sprintf_test_28);
  tcase_add_test(tc_core, sprintf_test_29);
  tcase_add_test(tc_core, sprintf_test_30);
  tcase_add_test(tc_core, sprintf_test_31);
  tcase_add_test(tc_core, sprintf_test_32);
  tcase_add_test(tc_core, sprintf_test_33);
  tcase_add_test(tc_core, sprintf_test_34);
  tcase_add_test(tc_core, sprintf_test_35);
  tcase_add_test(tc_core, sprintf_test_36);
  tcase_add_test(tc_core, sprintf_test_37);
  tcase_add_test(tc_core, sprintf_test_38);
  tcase_add_test(tc_core, sprintf_test_39);
  tcase_add_test(tc_core, sprintf_test_40);
  tcase_add_test(tc_core, sprintf_test_41);
  tcase_add_test(tc_core, sprintf_test_42);
  tcase_add_test(tc_core, sprintf_test_43);
  tcase_add_test(tc_core, sprintf_test_44);
  tcase_add_test(tc_core, sprintf_test_45);
  tcase_add_test(tc_core, sprintf_test_46);
  tcase_add_test(tc_core, sprintf_test_47);
  tcase_add_test(tc_core, sprintf_test_48);
  tcase_add_test(tc_core, sprintf_test_49);
  tcase_add_test(tc_core, sprintf_test_50);
  tcase_add_test(tc_core, sprintf_test_51);
  tcase_add_test(tc_core, sprintf_test_52);
  tcase_add_test(tc_core, sprintf_test_53);
  tcase_add_test(tc_core, sprintf_test_54);

  suite_add_tcase(s, tc_core);

  return s;
}

int main(void) {
  int number_failed;
  Suite *suites[] = {memchr_suite(),
                     memcmp_suite(),
                     memcpy_suite(),
                     memset_suite(),
                     strchr_suite(),
                     strcspn_suite(),
                     strerror_suite(),
                     strlen_suite(),
                     strncat_suite(),
                     strncmp_suite(),
                     strncpy_suite(),
                     strpbrk_suite(),
                     strrchr_suite(),
                     strstr_suite(),
                     strtok_suite(),
                     sprintf_suite(),
                     NULL};

  for (int i = 0; suites[i] != NULL; i++) {
    SRunner *sr;
    sr = srunner_create(suites[i]);
    srunner_run_all(sr, CK_NORMAL);
    number_failed = srunner_ntests_failed(sr);
    srunner_free(sr);
  }

  return (number_failed == 0) ? 0 : 1;
}