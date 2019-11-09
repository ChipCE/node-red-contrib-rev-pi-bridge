ifeq ($(CC),)
	CC = gcc
endif

IDIR =.
CFLAGS += -I. -I.. -std=c11
LDFLAGS = -shared
TARGET_LIB = dioBridge.so

ODIR = obj

_DEPS = piControl.h piControlIf.h dioBridge.h
DEPS = $(patsubst %,$(IDIR)/%,$(_DEPS))

_OBJ = piTest.o piControlIf.o dioBridge.o
OBJ = $(patsubst %,$(ODIR)/%,$(_OBJ))

_LINK_OBJ = piControlIf.o dioBridge.o
LINK_OBJ = $(patsubst %,$(ODIR)/%,$(_LINK_OBJ))

$(ODIR)/%.o: %.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

piTest: $(OBJ)
	$(CC) -o $@ $^ $(CFLAGS)

clean:
	rm -f $(ODIR)/*.o $(ODIR)/*.so piTest

lib:
	$(CC) ${LDFLAGS} -o $(TARGET_LIB) $(LINK_OBJ)

.PHONY: clean lib