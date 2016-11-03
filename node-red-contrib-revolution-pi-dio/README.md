This is a node.js module to use with node-red.
It adds read/write nodes to acces bits of
the Revolution Pi DIO Module.

It uses the getBit/setBit function of the piTest c-application.

Access via the ffi-module.

A shortended version of the piTest.c is compiled into a shared Library.

Please note, that there is no out of bounds check on the offset value...
segmentation faults can be caused easily.

Idea for using ffi comes from this project:
https://github.com/tmuellerWieland/revpi

Source Files for the piTest tool that are compiled into the libPiTest.so :
https://github.com/RevolutionPi/piControl

