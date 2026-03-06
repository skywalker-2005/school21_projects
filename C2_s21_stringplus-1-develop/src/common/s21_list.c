#include "s21_list.h"

node *init(const void *data, s21_size_t data_size) {
  node *newNode = (node *)malloc(sizeof(node));
  if (!newNode) return NULL;

  newNode->data = malloc(data_size);
  if (!newNode->data) {
    free(newNode);
    return NULL;
  }

  s21_memcpy(newNode->data, data, data_size);
  newNode->next = NULL;

  return newNode;
}

node *append(node **root, const void *data, s21_size_t dataSize) {
  if (!root) return NULL;

  node *newNode = init(data, dataSize);
  if (!newNode) return NULL;

  if (!*root) {
    *root = newNode;
    return newNode;
  }

  node *current = *root;
  while (current->next) current = current->next;
  current->next = newNode;

  return newNode;
}

node *insert(node **root, const void *data, s21_size_t dataSize,
             s21_size_t index) {
  if (!root) return NULL;

  node *newNode = init(data, dataSize);
  if (!newNode) return NULL;

  if (!*root) {
    *root = newNode;
    return newNode;
  }

  node *current = *root;

  if (index == 0) {
    newNode->next = *root;
    *root = newNode;
    return newNode;
  }

  s21_size_t initialIndex = 0;
  while (initialIndex < index - 1 && current->next) {
    current = current->next;
    initialIndex++;
  }

  newNode->next = current->next;
  current->next = newNode;

  return newNode;
}

node *pop(node **root, s21_size_t index) {
  if (!root || !*root) return NULL;
  node *current = *root;

  if (index == 0) {
    *root = current->next;
    current->next = NULL;
    return current;
  }

  s21_size_t initialIndex = 0;
  while (initialIndex < index && current->next->next) {
    current = current->next;
    initialIndex++;
  }

  node *poped = current->next;
  current->next = poped->next;
  poped->next = NULL;

  return poped;
}

node *find(node *root, int (*cmp)(const void *, const void *),
           const void *key) {
  node *current = root;

  while (current) {
    if (cmp(current->data, key) == 0) {
      return current;
    }
    current = current->next;
  }

  return NULL;
}

node *removeNode(node *elem, node *root) {
  if (!elem || !root) return root;

  node *current = root;
  node *previous = NULL;

  while (current) {
    if (current == elem) {
      if (previous) {
        previous->next = current->next;
      } else {
        root = current->next;
      }
      free(current->data);
      free(current);
      break;
    }
    previous = current;
    current = current->next;
  }

  return root;
}

s21_size_t len(node *root) {
  s21_size_t length = 0;
  node *current = root;

  while (current) {
    length++;
    current = current->next;
  }

  return length;
}

void destroy(node *root, void (*free_data)(void *)) {
  while (root) {
    node *next = root->next;

    if (free_data) {
      free_data(root->data);
    } else {
      free(root->data);
    }

    free(root);
    root = next;
  }
}
