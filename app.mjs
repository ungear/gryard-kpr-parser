import * as https  from 'https';
import { parse } from 'node-html-parser';
import { isTableWithRecipes, getRecipesFromTable } from './utils.mjs';
import { relinkElectroPowder, addCustomSpriteCoords } from './final-polishing.mjs';
import * as fs from 'fs';

main();

async function main(){
  let input;
  try {
    input = JSON.parse(fs.readFileSync('./input.json'));
  } catch(e){
    console.error('Error when reading input file');
    throw e;
  }
  const recipeUrls = input.recipeUrls;
  let recipes = [];
  const spriteCoords = {};
  const itemTitles = {};
  for await (const url of recipeUrls) {
    console.log('Processing ' + url);
    const rawHtml = await getHtml(url);
    const root = parse(rawHtml);
    const tables = root.querySelectorAll('table');
    const recipeTables = tables.filter(t => isTableWithRecipes(t));
    const recipesOutput = getRecipesFromTable(recipeTables[0], spriteCoords, itemTitles);
    recipes = [...recipes, ...recipesOutput];
  }

  let output = {
    recipes,
    spriteCoords,
    itemTitles
  }

  try {
    output = relinkElectroPowder(output);
    output = addCustomSpriteCoords(output);
  } catch(error){
    console.error('Error when polishing output');
    console.error(err);
    process.exit(1);
  }

  try {
    fs.writeFileSync('./result.json', JSON.stringify(output, null, 2));
    console.log('Results file created!')
  } catch (err) {
    console.error('Error when writing result file');
    console.error(err);
  }
}

async function getHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => { resolve(rawData)});
    }).on('error', (e) => {
      console.error(e);
      reject(e)
    });
  })
}