/*!
 *
 * Project: piTest
 * Demo source code for usage of piControl driver
 *
 * MIT License
 *
 * Copyright (C) 2017 : KUNBUS GmbH, Heerweg 15C, 73370 Denkendorf, Germany
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * \file piTestlib.c
 *
 * \This is a abrevation of the piTest program to compile into a shared library
 * that can be used via ffi in node.js so the getBit and setBit function is available
 * in node.js
 */

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


/***********************************************************************************/
/*!
 * @brief Set a bit
 *
 * Write a bit at a specific offset to a device.
 *
 * @param[in]   Offset
 * @param[in]   Bit number (0 - 7)
 * @param[in]   Value to write (0/1)
 *
 ************************************************************************************/
int setBit(int offset, int bit, int value)
{
	int rc;
	SPIValue sPIValue;

	// Check bit
	if (bit < 0 || bit > 7) {
		printf("Wrong bit number. Try 0 - 7\n");
		return -1;
	}
	// Check value
	if (value != 0 && value != 1) {
		printf("Wrong value. Try 0/1\n");
		return -2;
	}

	sPIValue.i16uAddress = offset;
	sPIValue.i8uBit = bit;
	sPIValue.i8uValue = value;
	// Set bit
	rc = piControlSetBitValue(&sPIValue);
	if (rc < 0) {
		return -3;
	} else {
		return 1;
	}
}

/***********************************************************************************/
/*!
 * @brief Get a bit
 *
 * Read a bit at a specific offset from a device.
 *
 * @param[in]   Offset
 * @param[in]   Bit number (0 - 7)
 *
 ************************************************************************************/
int getBit(int offset, int bit)
{
	int rc;
	SPIValue sPIValue;

	// Check bit
	if (bit < 0 || bit > 7) {
		printf("Wrong bit number. Try 0 - 7\n");
		return -1;
	}

	sPIValue.i16uAddress = offset;
	sPIValue.i8uBit = bit;
	// Get bit
	rc = piControlGetBitValue(&sPIValue);
	if (rc < 0) {
		return -2;
	}
	 else {
		return sPIValue.i8uValue;
	}
}
