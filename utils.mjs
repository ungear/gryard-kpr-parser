export function isTableWithRecipes(tableDom){
  return tableDom.innerText.toLowerCase().includes('item produced')
}

export function getRecipesFromTable(tableDom, spriteCoords, itemTitles){
  const rows = tableDom
    .querySelectorAll('tr')
    .filter(tr => !tr.querySelector('th')); // remove table header
  
  let lastingResult;
  const recipes = [];
  for(const row of rows){
    const cells = row
      .querySelectorAll('td')
      .filter(td => td.innerText && td.innerText.trim().length) // empty rows sometimes appear as the last column
      .filter(td => !td.innerHTML.toLowerCase().includes('game_of_crone')) // DLC links sometimes appear as the last column

    let resultCell;
    let ingredientsCell;
    
    if(cells.length === 3 || cells.length === 4){
      // regular row. Result is in the first cell, ingredients in the second one
      resultCell = cells[0];
      ingredientsCell = cells[1];
      if (cells[0].attributes.rowspan) lastingResult = resultCell;
    } else if(cells.length === 2) {
      // result set via rowspan in some previous row
      resultCell = lastingResult;
      ingredientsCell = cells[0];
    } else {
      console.error('Strange row with ' + row.innerHTML);
      console.error('Cells number is ' + cells.length);
      continue;
    }
    
    try {
      const result = getResultFromCell(resultCell);
      const resultId = result.id;

      // pushing sprite coords for result
      if(!spriteCoords[resultId] && result.spriteCoords) 
        spriteCoords[resultId] = result.spriteCoords;
      
      // pushing item title for result
      if(!itemTitles[resultId] && result.title) 
        itemTitles[resultId] = result.title;

      const ingredientsData = getIngredientIdsFromCell(ingredientsCell);
      
      // pushing sprite coords amd titles for ingredients
      ingredientsData.forEach(ingData => {
        if(!spriteCoords[ingData.id] && ingData.spriteCoords && ingData.spriteCoords !=='-0px -0px') 
          spriteCoords[ingData.id] = ingData.spriteCoords;

        if(!itemTitles[ingData.id] && ingData.title) 
          itemTitles[ingData.id] = ingData.title;
      })
      
      const ingredientIds = ingredientsData.map(x => x.id);
      if(resultId && ingredientIds && ingredientIds.length) {
        recipes.push({
          result: resultId,
          ingredients: ingredientIds,
        })
      } else {
        console.error('Strange result and ingredients for ' + row.innerHTML);
        console.error(`ResultId is ${resultId}, ingredientIds is ${ingredientIds}.`);
      }
    } catch(error) {
      console.error(error)
      console.error('Could not get ids from row ' + row.innerHTML);
    }
  };

  return recipes;
}


function getResultFromCell(cellDom){
  const resultSpan = cellDom.querySelector(':scope > span');
  const result = getRecipeItemProperties(resultSpan);
  return result;
}

function getIngredientIdsFromCell(cellDom){
  const isCellHasP = cellDom.querySelectorAll(':scope > p').length > 0;
  
  const recipeItemSpans = isCellHasP 
    ? [...cellDom.querySelectorAll(':scope > span'), ...cellDom.querySelectorAll(':scope > p > span')]
    : cellDom.querySelectorAll(':scope > span');

  const ingredients = recipeItemSpans.map(x => getRecipeItemProperties(x));
  return ingredients;
}

function getRecipeItemProperties(recipeItemSpan){
  const link = recipeItemSpan.querySelector('a'); // assuming that the first link points to desirable item
  const title = link 
    ? link.attributes.title
    : getItemTitleFromLinklessCell(recipeItemSpan);
  const id = link 
    ? getItemIdFromLink(link)
    : title.toLowerCase().replace(' ', '_').replace('\'', '');
  const iconEl = recipeItemSpan.querySelector('.item-sprite');

  return {
    id,
    title,
    spriteCoords: getSpriteCoordsFromIcon(iconEl)
  };
}

// returns "black_paint" from <a href="/wiki/Black_paint">
function getItemIdFromLink(aTag){
  const url = aTag.attributes.href;
  const urlSegments = url.split('/');
  const lastSegment = urlSegments[urlSegments.length - 1];
  return lastSegment.toLowerCase();
}

function getItemTitleFromLinklessCell(recipeItemSpan){
  const spans = recipeItemSpan.querySelectorAll('span');
  let id;
  try {
    id = spans[spans.length-1].innerText;
  } catch(error){
    console.error('Could not get id from linkless cell');
    console.error(error);
    id = 'not-found';
  }
  return id;
}

function getSpriteCoordsFromIcon(iconEl){
  let spriteCoords;
  try{
    spriteCoords = iconEl.attributes.style
      .split(';')
      .filter(x => x.startsWith('background-position'))
      .filter((x, index) => index === 0)
      .reduce((acc, curr) => { return curr.replace(/background-position\:/, '')}, null)
  } catch(err) {
    console.log('Error when extracting sprite coords for '+ iconEl.innerHTML);
    spriteCoords = null;
  }

  return spriteCoords;
}

