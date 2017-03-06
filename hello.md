# Hello WebAssembly

Production C/C++ compilers like Emscripten/LLVM produce WebAssembly
with extensive external bindings and standard libraries.
When all of that is stripped away, a simple hello world program
looks something like this:

```
Address  Raw Bytes                                 Description
-------  ---------                                 -----------

0000000: 0061 736d ("\0asm")                       ; WASM_BINARY_MAGIC
0000004: 0d00 0000                                 ; WASM_BINARY_VERSION

; section "TYPE" (1)
0000008: 01                                        ; section code
0000009: 0d                                        ; section size
000000a: 03                                        ; num types
 ; type 0
 00000b: 60                                        ; func
 00000c: 02                                        ; num params
 00000d: 7f                                        ; i32
 00000e: 7f                                        ; i32
 00000f: 00                                        ; num results
 ; type 1
 000010: 60                                        ; func
 000011: 00                                        ; num params
 000012: 00                                        ; num results
 ; type 2
 000013: 60                                        ; func
 000014: 00                                        ; num params
 000015: 01                                        ; num results
 000016: 7f                                        ; i32

; section "IMPORT" (2)
0000017: 02                                        ; section code
0000018: 0f                                        ; section size
0000019: 01                                        ; num imports
 ; import header 0
 ; extern void write(char* str, int len);
 00001a: 05                                        ; string length
 00001b: 7374 6469 6f                             stdio  ; import module name
 000020: 05                                        ; string length
 000021: 7772 6974 65                             write  ; import field name
 000026: 00                                        ; import kind
 000027: 00                                        ; import signature index

; section "FUNCTION" (3)
0000028: 03                                        ; section code
0000029: 03                                        ; section size
000002a: 02                                        ; num functions
 00002b: 01                                        ; function 0 signature index
 00002c: 02                                        ; function 1 signature index

; section "MEMORY" (5)
000002d: 05                                        ; section code
000002e: 04                                        ; section size
000002f: 01                                        ; num memories
 ; memory 0
 000030: 01                                        ; memory flags
 000031: 10                                        ; memory initial pages
 000032: 20                                        ; memory max pages

; section "EXPORT" (7)
0000033: 07                                        ; section code
0000034: 0f                                        ; section size
0000035: 02                                        ; num exports
 ; export WebAssembly heap as .heap
 000036: 04                                        ; string length
 000037: 6865 6170                                heap  ; export name
 00003b: 02                                        ; export kind
 00003c: 00                                        ; export memory index
 00003d: 04                                        ; string length
 ; export int main();
 00003e: 6d61 696e                                main  ; export name
 000042: 00                                        ; export kind
 000043: 00                                        ; export func index

; section "CODE" (10)
0000044: 0a                                        ; section code
0000045: 2e                                        ; section size
0000046: 02                                        ; num functions

; function body 0 (hi)
0000047: 09                                        ; func body size
0000048: 00                                        ; local decl count
                                               ; static void hi() {
 000049: 41 e4 00         | i32.const 0x64     ;
 00004c: 41 12            | i32.const 0x12     ;
 00004e: 10 00            | call 0             ;   write("Hello WebAssembly\n", 18);
                                               ; }
; function body 1 (main)
0000051: 22                                        ; func body size
0000052: 01                                        ; local decl count
0000053: 01                                        ; local type count
0000054: 7f                                        ; i32
                                               ; int main() {
 000055: 41 00            | i32.const 0        ;
 000057: 21 00            | set_local 0        ;   i = 0;

 000059: 02 40            | block              ;   while (i < 10) {
 00005b: 03 40            |   loop             ;
 00005d: 20 00            |     get_local 0    ;
 00005f: 41 0a            |     i32.const 0xa  ;
 000061: 48               |     i32.lt_s       ;
 000062: 0d 01            |     br_if 0x1      ;

 000064: 10 01            |     call 0x1       ;     hi();

 000066: 20 00            |     get_local 0    ;
 000068: 41 01            |     i32.const 0x1  ;
 00006a: 6a               |     i32.add        ;
 00006b: 21 00            |     set_local 0    ;     i = i + 1;

 00006d: 0c 00            |     br 0           ;
 00006f: 0b               |   end              ;
 000070: 0b               | end                ;   }
 000071: 41 00            | i32.const 0        ;   return 0;
                                               ; }

; section "DATA" (11)
0000074: 0b                                        ; section code
0000075: 19                                        ; section size
0000076: 01                                        ; num data segments
; data segment header 0
0000077: 00                                        ; memory index
0000078: 41                                        ; i32.const
0000079: e400                                      ; i32 literal
000007b: 0b                                        ; end
000007c: 12                                        ; data segment size
; data segment data 0
000007d: 4865 6c6c 6f20 5765 6241 7373 656d 626c   ; "Hello WebAssembly\n"
000008d: 790a                                      ; data segment data

```

The original C program:

``` cpp
extern void write(char* str, int len);

static void hi() {
  write("Hello WebAssembly\n", 18);
}

int main() {
  int i;
  i = 0;
  while (i < 10) {
    hi();
    i = i + 1;
  }
  return 0;
}
```
