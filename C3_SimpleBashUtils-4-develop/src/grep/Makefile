all: s21_grep

FL = -Wall -Wextra -Werror

s21_grep: grep.c
	gcc $(FL) grep.c -o s21_grep

rebuild: clean all

clean:
	rm -f s21_grep