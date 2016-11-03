CLEANEXTS = o so
CFLAGS += -I. -I.. -std=c11
SOURCES = piControlIf.c dioBridge.c
OUTPUTFILE = revPiIoBridge.so
INSTALLDIR = ../revpi-io-nodes/
TARGET_LIB = dioBridge.so

.PHONY: all
all: $(OUTPUTFILE)

$(OUTPUTFILE): $(subst .c,.o,$(SOURCES))
	$(CXX) -shared -fPIC $(LDFLAGS) -o $@ $^

.PHONY: install
install:
	#mkdir -p $(INSTALLDIR)
	yes | cp -p $(OUTPUTFILE) $(INSTALLDIR)

.PHONY: clean
clean:
	for file in $(CLEANEXTS); do rm -f *.$$file; done

include $(subst .c,.d,$(SOURCES))

%.d: %.c
	$(CC) -M $(CFLAGS) $< > $@.$$$$; \
	sed 's,\($*\)\.o[ :]*,\1.o $@ : ,g' < $@.$$$$ > $@; \
rm -f $@.$$$$
