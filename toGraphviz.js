const data = require('./result.json');

const recipes = data.recipes;
let result = '';
recipes.forEach((x, resIndex) => {
  x.ingredients.forEach(ing => {
    result += ing + '->' + x.result + ';';
  })
})
const clearResult = result.replace(/%/g, '')
console.log(clearResult);