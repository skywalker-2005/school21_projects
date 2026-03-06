all: s21_cat

FL = -Wall -Wextra -Werror

s21_cat: cat.c
	gcc $(FL) cat.c -o s21_cat

rebuild: clean all

clean:
	rm -f s21_cat