
/*
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
*/
#include "dioBridge.h"

int main(int argc, char *argv[])
{
	printf("%d",readDIO("RS485ErrorLimit2"));

	return 0;
}
