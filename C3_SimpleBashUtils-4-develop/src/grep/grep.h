#include <getopt.h>
#include <stddef.h>

const char* short_options = "eivclnhsfo";

const struct option long_options[] = {
    {"regexp=", required_argument, NULL, 'e'},
    {"ignore-case", no_argument, NULL, 'i'},
    {"invert-match", no_argument, NULL, 'v'},
    {"count", no_argument, NULL, 'c'},
    {"files-with-matches", no_argument, NULL, 'l'},
    {"line-number", no_argument, NULL, 'n'},
    {"no-filename", no_argument, NULL, 'h'},
    {"no-messages", no_argument, NULL, 's'},
    {"file=", required_argument, NULL, 'f'},
    {"only-matching", no_argument, NULL, 'o'},
    {NULL, 0, NULL, 0}};
