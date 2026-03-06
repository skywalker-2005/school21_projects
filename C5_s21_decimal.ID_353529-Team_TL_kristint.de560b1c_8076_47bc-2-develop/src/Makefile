CC = gcc
FLAGS= -std=c11 -Wall -Werror -Wextra
COVERAGE=
UNAME:=$(shell uname -s)
ifeq ($(UNAME),Linux)
	LDFLAGS=-lcheck -lm -lrt -lpthread -lsubunit
	OPEN_CM=xdg-open
endif
ifeq ($(UNAME),Darwin)
	LDFLAGS=-lcheck -lm
	OPEN_CM=open
endif

all: clean s21_decimal.a
deafult: all
s21_decimal.o:
	gcc $(FLAGS) -c functions/*/*.c functions/*.c
s21_decimal.a: s21_decimal.o 
	ar cr s21_decimal.a *.o
clean:
	rm -rf *.a *.o *.out *.html *.css *.gcno *.gcov *.gcda *.info s21_decimal report
test: clean
	gcc $(FLAGS) $(COVERAGE) -o s21_decimal tests/*.c tests/*/*.c functions/*/*.c functions/*.c -lcheck -lm $(LDFLAGS)
	./s21_decimal
add_coverage_flag:
	$(eval FLAGS += --coverage)
gcov_report: add_coverage_flag test
	@mkdir -p report
	gcov *.gcda
	gcovr --html --html-details -o report/coverage_report.html \
	      --filter="functions/.*\.c" \
	      --exclude="functions/helpers/.*" \
	      --exclude-unreachable-branches \
	      --print-summary
	@echo "Coverage report generated for functions/*.c (excluding helpers)"
	@cd ./report && $(OPEN_CM) coverage_report.html