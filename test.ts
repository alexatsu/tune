// function slow(value: number) {
//   let counter = value;

//   for (let i = 0; i < 100; i++) {
//     counter += 1;
//   }

//   console.log(counter);
//   return counter;
// }

// const cache = new Map();

// function cacheFunc(fn: Function, val: number) {
//   if (cache.has(val)) {
//     console.log("got from cache");
//     return cache.get(val);
//   }

//   let result = fn(val);
//   cache.set(val, result);
//   console.log("data cached");
//   return result;
// }
// cacheFunc(slow, 1);
// cacheFunc(slow, 4);
// cacheFunc(slow, 4);
function debounce(value: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => console.log(value), 1000);
  };
}

debounce(5);
