(function set_local_wast_js() {


// set_local.wast:3

let $1 = instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\xa5\x80\x80\x80\x00\x07\x60\x00\x00\x60\x01\x7f\x00\x60\x01\x7e\x00\x60\x01\x7d\x00\x60\x01\x7c\x00\x60\x05\x7e\x7d\x7c\x7f\x7f\x00\x60\x05\x7e\x7d\x7c\x7f\x7f\x01\x7e\x03\x8b\x80\x80\x80\x00\x0a\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x9e\x81\x80\x80\x00\x0a\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x69\x33\x32\x00\x00\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x69\x36\x34\x00\x01\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x66\x33\x32\x00\x02\x0e\x74\x79\x70\x65\x2d\x6c\x6f\x63\x61\x6c\x2d\x66\x36\x34\x00\x03\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x69\x33\x32\x00\x04\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x69\x36\x34\x00\x05\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x33\x32\x00\x06\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x36\x34\x00\x07\x0a\x74\x79\x70\x65\x2d\x6d\x69\x78\x65\x64\x00\x08\x05\x77\x72\x69\x74\x65\x00\x09\x0a\x8e\x82\x80\x80\x00\x0a\x88\x80\x80\x80\x00\x01\x01\x7f\x41\x00\x21\x00\x0b\x88\x80\x80\x80\x00\x01\x01\x7e\x42\x00\x21\x00\x0b\x8b\x80\x80\x80\x00\x01\x01\x7d\x43\x00\x00\x00\x00\x21\x00\x0b\x8f\x80\x80\x80\x00\x01\x01\x7c\x44\x00\x00\x00\x00\x00\x00\x00\x00\x21\x00\x0b\x86\x80\x80\x80\x00\x00\x41\x0a\x21\x00\x0b\x86\x80\x80\x80\x00\x00\x42\x0b\x21\x00\x0b\x89\x80\x80\x80\x00\x00\x43\x9a\x99\x31\x41\x21\x00\x0b\x8d\x80\x80\x80\x00\x00\x44\x66\x66\x66\x66\x66\x66\x28\x40\x21\x00\x0b\xc0\x80\x80\x80\x00\x03\x01\x7d\x02\x7e\x01\x7c\x42\x00\x21\x00\x43\x00\x00\x00\x00\x21\x01\x44\x00\x00\x00\x00\x00\x00\x00\x00\x21\x02\x41\x00\x21\x03\x41\x00\x21\x04\x43\x00\x00\x00\x00\x21\x05\x42\x00\x21\x06\x42\x00\x21\x07\x44\x00\x00\x00\x00\x00\x00\x00\x00\x21\x08\x0b\xcf\x80\x80\x80\x00\x03\x01\x7d\x02\x7e\x01\x7c\x43\x9a\x99\x99\xbe\x21\x01\x41\x28\x21\x03\x41\x79\x21\x04\x43\x00\x00\xb0\x40\x21\x05\x42\x06\x21\x06\x44\x00\x00\x00\x00\x00\x00\x20\x40\x21\x08\x20\x00\xba\x20\x01\xbb\x20\x02\x20\x03\xb8\x20\x04\xb7\x20\x05\xbb\x20\x06\xba\x20\x07\xba\x20\x08\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xb0\x0b");



// set_local.wast:68

assert_return(() => call($1, "type-local-i32", []));



// set_local.wast:69

assert_return(() => call($1, "type-local-i64", []));



// set_local.wast:70

assert_return(() => call($1, "type-local-f32", []));



// set_local.wast:71

assert_return(() => call($1, "type-local-f64", []));



// set_local.wast:73

assert_return(() => call($1, "type-param-i32", [2]));



// set_local.wast:74

run(() => call(instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x01\x7e\x00\x02\x95\x80\x80\x80\x00\x01\x02\x24\x31\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x69\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x00\x02\x40\x42\x03\x10\x00\x0f\x0b\x00\x0b", exports("$1", $1)),  "run", []));  // assert_return(() => call($1, "type-param-i64", [int64("3")]))



// set_local.wast:75

run(() => call(instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x01\x7d\x00\x02\x95\x80\x80\x80\x00\x01\x02\x24\x31\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x33\x32\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x94\x80\x80\x80\x00\x01\x8e\x80\x80\x80\x00\x00\x02\x40\x43\xcd\xcc\x8c\x40\x10\x00\x0f\x0b\x00\x0b", exports("$1", $1)),  "run", []));  // assert_return(() => call($1, "type-param-f32", [4.40000009537]))



// set_local.wast:76

run(() => call(instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x88\x80\x80\x80\x00\x02\x60\x00\x00\x60\x01\x7c\x00\x02\x95\x80\x80\x80\x00\x01\x02\x24\x31\x0e\x74\x79\x70\x65\x2d\x70\x61\x72\x61\x6d\x2d\x66\x36\x34\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\x98\x80\x80\x80\x00\x01\x92\x80\x80\x80\x00\x00\x02\x40\x44\x00\x00\x00\x00\x00\x00\x16\x40\x10\x00\x0f\x0b\x00\x0b", exports("$1", $1)),  "run", []));  // assert_return(() => call($1, "type-param-f64", [5.5]))



// set_local.wast:78

run(() => call(instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x8c\x80\x80\x80\x00\x02\x60\x00\x00\x60\x05\x7e\x7d\x7c\x7f\x7f\x00\x02\x91\x80\x80\x80\x00\x01\x02\x24\x31\x0a\x74\x79\x70\x65\x2d\x6d\x69\x78\x65\x64\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xa3\x80\x80\x80\x00\x01\x9d\x80\x80\x80\x00\x00\x02\x40\x42\x01\x43\xcd\xcc\x0c\x40\x44\x66\x66\x66\x66\x66\x66\x0a\x40\x41\x04\x41\x05\x10\x00\x0f\x0b\x00\x0b", exports("$1", $1)),  "run", []));  // assert_return(() => call($1, "type-mixed", [int64("1"), 2.20000004768, 3.3, 4, 5]))



// set_local.wast:84

run(() => call(instance("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x8d\x80\x80\x80\x00\x02\x60\x00\x00\x60\x05\x7e\x7d\x7c\x7f\x7f\x01\x7e\x02\x8c\x80\x80\x80\x00\x01\x02\x24\x31\x05\x77\x72\x69\x74\x65\x00\x01\x03\x82\x80\x80\x80\x00\x01\x00\x07\x87\x80\x80\x80\x00\x01\x03\x72\x75\x6e\x00\x01\x0a\xab\x80\x80\x80\x00\x01\xa5\x80\x80\x80\x00\x00\x02\x40\x42\x01\x43\x00\x00\x00\x40\x44\x66\x66\x66\x66\x66\x66\x0a\x40\x41\x04\x41\x05\x10\x00\x01\x42\x38\x01\x51\x45\x0d\x00\x0f\x0b\x00\x0b", exports("$1", $1)),  "run", []));  // assert_return(() => call($1, "write", [int64("1"), 2., 3.3, 4, 5]), int64("56"))



// set_local.wast:94

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x00\x01\x7e\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8e\x80\x80\x80\x00\x01\x88\x80\x80\x80\x00\x01\x01\x7f\x41\x00\x21\x00\x0b");



// set_local.wast:100

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x01\x01\x7d\x43\x00\x00\x00\x00\x21\x00\x45\x0b");



// set_local.wast:106

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x02\x01\x7c\x01\x7e\x42\x00\x21\x01\x9a\x0b");



// set_local.wast:113

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8d\x80\x80\x80\x00\x01\x87\x80\x80\x80\x00\x01\x01\x7f\x01\x21\x00\x0b");



// set_local.wast:117

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x01\x01\x7f\x43\x00\x00\x00\x00\x21\x00\x0b");



// set_local.wast:121

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x95\x80\x80\x80\x00\x01\x8f\x80\x80\x80\x00\x01\x01\x7d\x44\x00\x00\x00\x00\x00\x00\x00\x00\x21\x00\x0b");



// set_local.wast:125

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x97\x80\x80\x80\x00\x01\x91\x80\x80\x80\x00\x02\x01\x7c\x01\x7e\x44\x00\x00\x00\x00\x00\x00\x00\x00\x21\x01\x0b");



// set_local.wast:133

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x60\x01\x7f\x01\x7e\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8a\x80\x80\x80\x00\x01\x84\x80\x80\x80\x00\x00\x20\x00\x0b");



// set_local.wast:137

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7d\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x20\x00\x45\x0b");



// set_local.wast:141

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x60\x02\x7c\x7e\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x20\x01\x9a\x0b");



// set_local.wast:146

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7f\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8b\x80\x80\x80\x00\x01\x85\x80\x80\x80\x00\x00\x01\x21\x00\x0b");



// set_local.wast:150

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7f\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8f\x80\x80\x80\x00\x01\x89\x80\x80\x80\x00\x00\x43\x00\x00\x00\x00\x21\x00\x0b");



// set_local.wast:154

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7d\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x93\x80\x80\x80\x00\x01\x8d\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x00\x21\x00\x0b");



// set_local.wast:158

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x60\x02\x7c\x7e\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x93\x80\x80\x80\x00\x01\x8d\x80\x80\x80\x00\x00\x44\x00\x00\x00\x00\x00\x00\x00\x00\x21\x01\x0b");



// set_local.wast:166

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8e\x80\x80\x80\x00\x01\x88\x80\x80\x80\x00\x02\x01\x7f\x01\x7e\x20\x03\x0b");



// set_local.wast:170

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x02\x01\x7f\x01\x7e\x20\xf7\xa4\xea\x06\x0b");



// set_local.wast:175

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x60\x02\x7f\x7e\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8a\x80\x80\x80\x00\x01\x84\x80\x80\x80\x00\x00\x20\x02\x0b");



// set_local.wast:179

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x84\x80\x80\x80\x00\x01\x60\x00\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x92\x80\x80\x80\x00\x01\x8c\x80\x80\x80\x00\x02\x01\x7f\x01\x7e\x20\xf7\xf2\xce\xd4\x02\x0b");



// set_local.wast:184

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7f\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x8e\x80\x80\x80\x00\x01\x88\x80\x80\x80\x00\x02\x01\x7f\x01\x7e\x20\x03\x0b");



// set_local.wast:188

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7e\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x02\x01\x7f\x01\x7e\x20\xf7\xa8\x99\x66\x0b");



// set_local.wast:193

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7d\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x01\x01\x7f\x43\x00\x00\x00\x00\x21\x01\x0b");



// set_local.wast:197

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x86\x80\x80\x80\x00\x01\x60\x02\x7e\x7f\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x91\x80\x80\x80\x00\x01\x8b\x80\x80\x80\x00\x01\x01\x7d\x43\x00\x00\x00\x00\x21\x01\x0b");



// set_local.wast:201

assert_invalid("\x00\x61\x73\x6d\x01\x00\x00\x00\x01\x85\x80\x80\x80\x00\x01\x60\x01\x7e\x00\x03\x82\x80\x80\x80\x00\x01\x00\x0a\x90\x80\x80\x80\x00\x01\x8a\x80\x80\x80\x00\x02\x01\x7c\x01\x7e\x42\x00\x21\x01\x0b");

reinitializeRegistry();
})();