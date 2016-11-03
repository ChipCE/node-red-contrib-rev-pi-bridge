
#ifndef __WIFI_MAN_H
#define __WIFI_MAN_H

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <termios.h>
#include <getopt.h>
#include <time.h>
#include <sys/types.h>
#include <stdbool.h>

#include "piControlIf.h"
#include "piControl.h"

#define LIB_DEBUG

int writeDIO(char *pszVariableName, uint32_t i32uValue);
int readDIO(char *pszVariableName);
int resetDIO();
char *getWriteError(int error);

#endif