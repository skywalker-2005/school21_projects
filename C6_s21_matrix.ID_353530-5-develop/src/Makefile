CC=gcc
CFLAGS=-std=c11 -Wall -Wextra -Werror -g
CHECK_FLAGS=-lcheck -lm -lsubunit -lrt -lpthread

TEST_DIR=tests
BUILD_DIR=build
GCOV_REPORT=gcov_report

AR=ar rcs
RM=rm -rf

LIBRARY_SOURCES=$(wildcard s21_*.c) check_conditions.c
LIBRARY_OBJECTS=$(LIBRARY_SOURCES:%.c=$(BUILD_DIR)/%.o)
LIBRARY=s21_matrix.a
TESTS=a.out

.PHONY: all clean test gcov_report debug verbose_test valgrind

debug:
	@echo "LIBRARY SOURCES: $(LIBRARY_SOURCES)"
	@echo "LIBRARY OBJECTS: $(LIBRARY_OBJECTS)"
	@ls -la s21_*.c 2>/dev/null || echo "Нет файлов s21_*.c"

all: $(LIBRARY) $(TESTS)
	@echo "Build complete: $(LIBRARY), $(TESTS)"

$(BUILD_DIR)/%.o: %.c | $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(LIBRARY): $(LIBRARY_OBJECTS)
	$(AR) $@ $^
	@echo "Библиотека: $(words $(LIBRARY_OBJECTS)) объектов"

$(TESTS): $(LIBRARY)
	$(CC) $(CFLAGS) $(TEST_DIR)/*.c $(LIBRARY) $(CHECK_FLAGS) -o $(TESTS)

test: $(TESTS)
	@echo "Запуск тестов..."
	./$(TESTS)

verbose_test: $(LIBRARY)
	$(CC) $(CFLAGS) $(TEST_DIR)/*.c $(LIBRARY) $(CHECK_FLAGS) -o $(TESTS)
	@echo "🔍 Подробный запуск тестов..."
	CK_FORK=no CK_VERBOSE=1 ./$(TESTS) 2>&1 | grep -E "(Assertion|tests/test.c|Failed)"
	@echo "Готово! Проверьте ошибки выше"

gcov_report: CFLAGS += --coverage
gcov_report: clean
	$(CC) $(CFLAGS) $(LIBRARY_SOURCES) $(TEST_DIR)/*.c $(CHECK_FLAGS) -o $(TESTS)
	./$(TESTS)
	mkdir -p $(GCOV_REPORT)
	lcov -t $(TESTS) -o $(TESTS).info -c -d .
	genhtml -o $(GCOV_REPORT) $(TESTS).info
	xdg-open $(GCOV_REPORT)/index.html 
	@echo "Отчёт gcov открыт в браузере"

valgrind: $(LIBRARY)
	$(CC) $(CFLAGS) $(TEST_DIR)/*.c $(LIBRARY) $(CHECK_FLAGS) -o $(TESTS)
	valgrind --tool=memcheck --leak-check=yes --error-exitcode=1 ./$(TESTS)

clean:
	$(RM) $(LIBRARY) $(TESTS) *.o *.gcda *.gcno *.info $(BUILD_DIR) $(GCOV_REPORT)

rebuild: clean all