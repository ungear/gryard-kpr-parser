export function relinkElectroPowder(output){
  const electroPowderWrongId = 'yellow_electro_powder';
  const electroPowderCorrectId = 'electric_powder';
  output.recipes.forEach(rec => {
    const wrongElPowderIngredient = rec.ingredients.indexOf(electroPowderWrongId);
    if(wrongElPowderIngredient >= 0) rec.ingredients[wrongElPowderIngredient] = electroPowderCorrectId;
  })
  delete output.spriteCoords[electroPowderWrongId];
  delete output.itemTitles[electroPowderWrongId];
  return output;
}

export function addCustomSpriteCoords(output){
  const hardcodedCoordsById = {
    brown_paint: '-38px -1186px',
    blue_paint: '-74px -1186px',
    dark_green_paint: '-110px -1186px',
    green_paint: '-1px -1186px',
    dark_violet_paint: '-146px -1186px',
    violet_paint: '-182px -1186px',
    red_paint: '-218px -1186px',
    yellow_paint: '-250px -1186px',
    
    universal_bag: '-978px -719px',
    big_universal_bag: '-940px -719px',
    potion_bag: '-1013px -719px',
    builders_bag:  '-1048px -719px',
    food_bag: '-1083px -719px',
  }
  Object.entries(hardcodedCoordsById).forEach(([id, hardcocdedCoords]) => {
    if(output.spriteCoords[id] === '-0px -0px'){
      output.spriteCoords[id] = hardcocdedCoords;
    }
  })

  return output;
}