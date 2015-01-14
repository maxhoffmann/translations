module.exports = function t(input, values) {
  for(var key in values) {
    input = input.replace(new RegExp('{'+key+'}','g'), values[key]);
  }
  
  return input;
}
