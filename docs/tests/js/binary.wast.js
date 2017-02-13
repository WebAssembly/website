(function binary_wast_js() {


// binary.wast:1

let $1 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:2

let $2 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:3

let $3 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");

let $M1 = $3;



// binary.wast:4

let $4 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00");

let $M2 = $4;



// binary.wast:6

assert_malformed("");



// binary.wast:7

assert_malformed("\x01");



// binary.wast:8

assert_malformed("\x00\x61\x73");



// binary.wast:9

assert_malformed("\x61\x73\x6d\x00");



// binary.wast:10

assert_malformed("\x6d\x73\x61\x00");



// binary.wast:11

assert_malformed("\x6d\x73\x61\x00\x01\x00\x00\x00");



// binary.wast:12

assert_malformed("\x6d\x73\x61\x00\x00\x00\x00\x01");



// binary.wast:13

assert_malformed("\x61\x73\x6d\x01\x00\x00\x00\x00");



// binary.wast:14

assert_malformed("\x77\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:15

assert_malformed("\x7f\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:16

assert_malformed("\x80\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:17

assert_malformed("\x82\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:18

assert_malformed("\xff\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:21

assert_malformed("\x00\x00\x00\x01\x6d\x73\x61\x00");



// binary.wast:24

assert_malformed("\x61\x00\x6d\x73\x00\x01\x00\x00");



// binary.wast:25

assert_malformed("\x73\x6d\x00\x61\x00\x00\x01\x00");



// binary.wast:28

assert_malformed("\x00\x41\x53\x4d\x01\x00\x00\x00");



// binary.wast:31

assert_malformed("\x00\x81\xa2\x94\x01\x00\x00\x00");



// binary.wast:34

assert_malformed("\xef\xbb\xbf\x00\x61\x73\x6d\x01\x00\x00\x00");



// binary.wast:36

assert_malformed("\x00\x61\x73\x6d");



// binary.wast:37

assert_malformed("\x00\x61\x73\x6d\x01");



// binary.wast:38

assert_malformed("\x00\x61\x73\x6d\x01\x00\x00");



// binary.wast:39

assert_malformed("\x00\x61\x73\x6d\x00\x00\x00\x00");



// binary.wast:40

assert_malformed("\x00\x61\x73\x6d\x0d\x00\x00\x00");



// binary.wast:41

assert_malformed("\x00\x61\x73\x6d\x0e\x00\x00\x00");



// binary.wast:42

assert_malformed("\x00\x61\x73\x6d\x00\x01\x00\x00");



// binary.wast:43

assert_malformed("\x00\x61\x73\x6d\x00\x00\x01\x00");



// binary.wast:44

assert_malformed("\x00\x61\x73\x6d\x00\x00\x00\x01");

reinitializeRegistry();
})();