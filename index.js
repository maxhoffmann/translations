module.exports = function t(/* string */ input, /* object */ values) {
  for(var key in values) {
    input = input.replace(new RegExp('{'+key+'}','g'), values[key]);
  }
  
  return input;
}
