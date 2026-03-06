#ifndef LIST_H
#define LIST_H

#include <stdio.h>
#include <stdlib.h>

#include "../s21_basic_str_functions/s21_basic_str_funcs.h"

typedef struct node {
  void *data;
  struct node *next;
} node;

node *init(const void *data, s21_size_t data_size);
node *append(node **root, const void *data, s21_size_t dataSize);
node *insert(node **root, const void *data, s21_size_t dataSize,
             s21_size_t index);
node *pop(node **root, s21_size_t index);
node *find(node *root, int (*cmp)(const void *, const void *), const void *key);
node *removeNode(node *elem, node *root);
s21_size_t len(node *root);
void destroy(node *root, void (*free_data)(void *));

#endif
