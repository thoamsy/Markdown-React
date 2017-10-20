const moment = require('moment');
const R = require('ramda');
console.log(moment(Number(new Date('1996/12/25'))).fromNow());
console.log(R.zip([1,2,3], ['a', 'b','c']));