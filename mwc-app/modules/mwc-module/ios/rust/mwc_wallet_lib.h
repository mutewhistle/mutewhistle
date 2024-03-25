typedef struct api_server {} api_server;
            typedef struct wallet {} wallet;

#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

void cstr_free(char *s);

const char *c_init_wallet(const char *config_str,
                          const char *phrase,
                          const char *password,
                          uint8_t *error);

const char *c_get_test_string(const char *password, uint8_t *error);
