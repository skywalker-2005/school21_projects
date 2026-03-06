CC = gcc
CFLAGS = -Wall -Wextra -Werror
LIB_DIR = ./common/
B_DIR = ./s21_basic_str_functions/
SP_DIR = ./s21_sprintf/
BF = $(wildcard $(B_DIR)*.c)
TESTS = $(wildcard $(B_DIR)*.c $(SP_DIR)*.c $(LIB_DIR)*.c all_tests.c)
HEADERS = $(wildcard $(B_DIR)*.h $(SP_DIR)*.h $(LIB_DIR)*.h)
OBJ = $(BF:.c=.o)
EXEC = s21_string
GCOV_FLAGS=-fprofile-arcs -ftest-coverage


all: s21_string.a test gcov_report

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@ -I$(LIB_DIR) -I$(B_DIR)

s21_sprintf.o: $(SP_DIR)s21_sprintf.c $(SP_DIR)s21_sprintf.h
	$(CC) $(CFLAGS) -c $(SP_DIR)s21_sprintf.c -o $(SP_DIR)s21_sprintf.o -I$(LIB_DIR) -I$(B_DIR)

s21_list.o: $(LIB_DIR)s21_list.c $(LIB_DIR)s21_list.h $(B_DIR)s21_basic_str_funcs.h $(B_DIR)s21_memcpy.c
	$(CC) $(CFLAGS) -c $(LIB_DIR)s21_list.c -o $(LIB_DIR)s21_list.o -I$(LIB_DIR) -I$(B_DIR)

s21_string.a: s21_sprintf.o s21_list.o $(OBJ)
	ar rcs s21_string.a $(OBJ) $(LIB_DIR)s21_list.o $(SP_DIR)s21_sprintf.o

gcov_report:

	$(CC) $(FLAGS) $(GCOV_FLAGS) $(TESTS) -o test -lcheck -lm -lrt -lpthread -lsubunit

	./test
	lcov -t "test" -o test.info -c -d .
	genhtml -o report test.info
	lcov -remove test.info 'all_tests.c' -o test.info
	lcov -remove test.info 'common/s21_list.c' -o test.info
	genhtml -o report --function-coverage test.info
	rm -rf *.gcda *.gcno test

test:
	$(CC) $(CFLAGS) $(TESTS) -o tests.out -lcheck -lm -lrt -lpthread -lsubunit
	./tests.out

valgrind:
	valgrind --tool=memcheck --leak-check=yes ./tests.out


clang:
	clang-format -n $(TESTS) $(HEADERS)


clean:
	rm -rf *.o *a *.out $(LIB_DIR)*.o $(SP_DIR)*.o $(B_DIR)*.o
	rm -rf *.gcda
	rm -rf *.gcno
	rm -rf *.info
	
rebuild: clean all