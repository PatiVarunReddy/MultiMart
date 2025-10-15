const mongoose = require('mongoose');
module.exports = async function connect(uri){
  return mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
};
