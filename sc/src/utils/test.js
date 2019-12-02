const db = require('./nedb')('testdb');

// 第一种用法:async  await
(async function () {
  await db.insert({ number: 12, age: 14 });
  await db.insert({ number: 11, age: 14 });
  await db.insert({ number: 13, age: 14 });
  let res = await db.sort({ number: -1 }).limit(0, 2).find();
  console.log(res);
  res = await db.find({ number: { $gt: 12 } });
  console.log(res);
  res = await db.update({ number: 12 }, { $set: { number: 55 } }, { multi: true });
  console.log(res);
  res = await db.remove({ number: 11 }, { multi: true });
  console.log(res);
}());
