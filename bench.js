const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');

const JSONbig = require('./');

const json = '{ "value" : 9223372036854775807, "v2": 123 }';
console.log('Input:', json);
console.log('');

console.log('node.js built-in JSON:');
const r = JSON.parse(json);
console.log('JSON.parse(input).value : ', r.value.toString());
console.log('JSON.stringify(JSON.parse(input)):', JSON.stringify(r));

console.log('\n\nbig number JSON:');
const r1 = JSONbig.parse(json);
console.log('JSONbig.parse(input).value : ', r1.value.toString());
console.log('JSONbig.parse(input) : %o', r1);
console.log('JSONbig.stringify(JSONbig.parse(input)):', JSONbig.stringify(r1));

const JSONNativeBigInt = JSONbig({
  useNativeBigInt: true,
});
console.log('\n\nbig number JSON with useNativeBigInt = true:');
const r2 = JSONNativeBigInt.parse(json);
console.log('JSONNativeBigInt.parse(input).value : ', r2.value.toString());
console.log('JSONNativeBigInt.parse(input) : %o', r2);
console.log('JSONNativeBigInt.stringify(JSONNativeBigInt.parse(input)):', JSONNativeBigInt.stringify(r2));

const suite = new Benchmark.Suite();

suite
  .add('JSON.parse(json)', function() {
    JSON.parse(json);
  })
  .add('JSON.stringify(r)', function() {
    JSON.stringify(r);
  })
  .add("JSONbig.parse(json)", function() {
    JSONbig.parse(json);
  })
  .add("JSONbig.stringify(r1)", function() {
    JSONbig.stringify(r1)
  })
  .add("JSONNativeBigInt.parse(json)", function() {
    JSONbig.parse(json);
  })
  .add("JSONNativeBigInt.stringify(r2)", function() {
    JSONbig.stringify(r1)
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('start', function() {
    console.log('\n  node version: %s, date: %s\n  Starting...', process.version, Date());
  })
  .on('complete', function() {
    benchmarks.log();
  })
  .run({ async: false });

// node bench.js

// Input: { "value" : 9223372036854775807, "v2": 123 }

// node.js built-in JSON:
// JSON.parse(input).value :  9223372036854776000
// JSON.stringify(JSON.parse(input)): {"value":9223372036854776000,"v2":123}


// big number JSON:
// JSONbig.parse(input).value :  9223372036854775807
// JSONbig.parse(input) : [Object: null prototype] {
//   value: BigNumber {
//     s: 1,
//     e: 18,
//     c: [ 92233, 72036854775807, [length]: 2 ],
//     _isBigNumber: true
//   },
//   v2: 123
// }
// JSONbig.stringify(JSONbig.parse(input)): {"value":9223372036854775807,"v2":123}


// big number JSON with useNativeBigInt = true:
// JSONNativeBigInt.parse(input).value :  9223372036854775807
// JSONNativeBigInt.parse(input) : [Object: null prototype] { value: 9223372036854775807n, v2: 123 }
// JSONNativeBigInt.stringify(JSONNativeBigInt.parse(input)): {"value":9223372036854775807,"v2":123}

//   node version: v20.18.1, date: Mon Dec 16 2024 13:51:09 GMT+0800 (中国标准时间)
//   Starting...
//   6 tests completed.

//   JSON.parse(json)               x 3,610,730 ops/sec ±1.41% (94 runs sampled)
//   JSON.stringify(r)              x 5,061,780 ops/sec ±0.26% (99 runs sampled)
//   JSONbig.parse(json)            x 1,119,342 ops/sec ±1.85% (94 runs sampled)
//   JSONbig.stringify(r1)          x 3,088,651 ops/sec ±1.02% (94 runs sampled)
//   JSONNativeBigInt.parse(json)   x 1,130,115 ops/sec ±1.13% (98 runs sampled)
//   JSONNativeBigInt.stringify(r2) x 3,009,387 ops/sec ±2.39% (89 runs sampled)
  