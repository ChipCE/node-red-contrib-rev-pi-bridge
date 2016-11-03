#include "dioBridge.h"

int writeDIO(char *pszVariableName, uint32_t i32uValue)
{
	int rc;
	SPIVariable sPiVariable;
	SPIValue sPIValue;
	uint8_t i8uValue;
	uint16_t i16uValue;

	strncpy(sPiVariable.strVarName, pszVariableName, sizeof(sPiVariable.strVarName));
	rc = piControlGetVariableInfo(&sPiVariable);
	if (rc < 0) 
	{
		fprintf( stderr,"Cannot find variable '%s'\n", pszVariableName);
		return rc<0 ? rc : -rc;
	}

	if (sPiVariable.i16uLength == 1) 
	{
		sPIValue.i16uAddress = sPiVariable.i16uAddress;
		sPIValue.i8uBit = sPiVariable.i8uBit;
		sPIValue.i8uValue = i32uValue;
		rc = piControlSetBitValue(&sPIValue);
		if (rc < 0)
		{
			fprintf( stderr,"Set bit error %s\n", getWriteError(rc));
			return rc<0 ? rc : -rc;
		}
		else
		{
			printf("Set bit %d on byte at offset %d. Value %d\n", sPIValue.i8uBit, sPIValue.i16uAddress,sPIValue.i8uValue);
			return 0;
		}
	} 
	else if (sPiVariable.i16uLength == 8) 
	{
		i8uValue = i32uValue;
		rc = piControlWrite(sPiVariable.i16uAddress, 1, (uint8_t *) & i8uValue);
		if (rc < 0)
		{
			fprintf( stderr,"Write error %s\n", getWriteError(rc));
			return rc<0 ? rc : -rc;
		}
		else
		{
			printf("Write value %d dez (=%02x hex) to offset %d.\n", i8uValue, i8uValue,sPiVariable.i16uAddress);
			return 0;
		}
	} 
	else if (sPiVariable.i16uLength == 16) 
	{
		i16uValue = i32uValue;
		rc = piControlWrite(sPiVariable.i16uAddress, 2, (uint8_t *) & i16uValue);
		if (rc < 0)
		{
			fprintf( stderr,"Write error %s\n", getWriteError(rc));
			return rc<0 ? rc : -rc;
		}
		else
		{
			printf("Write value %d dez (=%04x hex) to offset %d.\n", i16uValue, i16uValue,sPiVariable.i16uAddress);
			return 0;
		}
	} 
	else if (sPiVariable.i16uLength == 32) 
	{
		rc = piControlWrite(sPiVariable.i16uAddress, 4, (uint8_t *) & i32uValue);
		if (rc < 0)
		{
			fprintf( stderr,"Write error %s\n", getWriteError(rc));
			return rc<0 ? rc : -rc;
		}
		else
		{
			printf("Write value %d dez (=%08x hex) to offset %d.\n", i32uValue, i32uValue,sPiVariable.i16uAddress);
			return 0;
		}
	}
}


int readDIO(char *pszVariableName)
{
	int rc;
	SPIVariable sPiVariable;
	SPIValue sPIValue;
	uint8_t i8uValue;
	uint16_t i16uValue;
	uint32_t i32uValue;

	strncpy(sPiVariable.strVarName, pszVariableName, sizeof(sPiVariable.strVarName));
	rc = piControlGetVariableInfo(&sPiVariable);
	if (rc < 0) 
	{
		fprintf( stderr,"Cannot find variable '%s'\n", pszVariableName);
		return rc<0 ? rc : -rc;
	}

	if (sPiVariable.i16uLength == 1) 
	{
		sPIValue.i16uAddress = sPiVariable.i16uAddress;
		sPIValue.i8uBit = sPiVariable.i8uBit;

		rc = piControlGetBitValue(&sPIValue);
		if (rc < 0)
		{
			fprintf( stderr,"Get bit error\n");
			return rc<0 ? rc : -rc;
		}
		else 
		{
			//printf("%d", sPIValue.i8uValue);
			//return 0;
            return sPIValue.i8uValue;
		}
	} 
	else if (sPiVariable.i16uLength == 8) 
	{
		rc = piControlRead(sPiVariable.i16uAddress, 1, (uint8_t *) & i8uValue);
		if (rc < 0)
		{
			fprintf( stderr,"Read error\n");
			return rc<0 ? rc : -rc;
		}
		else
		{
			//printf("%d", i8uValue);
			//return 0;
            return i8uValue;
		}
	} 
	else if (sPiVariable.i16uLength == 16) 
	{
		rc = piControlRead(sPiVariable.i16uAddress, 2, (uint8_t *) & i16uValue);
		if (rc < 0)
		{
			fprintf( stderr,"Read error\n");
			return rc<0 ? rc : -rc;
		}
		else 
		{
			//printf("%d", i16uValue);
			//return 0;
            return i16uValue;
		}
	} 
	else if (sPiVariable.i16uLength == 32) 
	{
		rc = piControlRead(sPiVariable.i16uAddress, 4, (uint8_t *) & i32uValue);
		if (rc < 0)
		{
			fprintf( stderr,"Read error\n");
			return rc<0 ? rc : -rc;
		}
		else 
		{
			//printf("%d", i32uValue);
			//return 0;
            return i32uValue;
		}
	} 
	else
	{
		fprintf( stderr,"Could not read variable %s. Internal Error\n", pszVariableName);
		return rc<0 ? rc : -rc;
	}
}

int resetDIO()
{
	return piControlReset();
}

char *getWriteError(int error)
{
	static char *WriteError[] = {
		"Cannot connect to control process",
		"Offset seek error",
		"Cannot write to control process",
		"Unknown error"
	};
	switch (error) {
	case -1:
		return WriteError[0];
		break;
	case -2:
		return WriteError[1];
		break;
	case -3:
		return WriteError[2];
		break;
	default:
		return WriteError[3];
		break;
	}
}
