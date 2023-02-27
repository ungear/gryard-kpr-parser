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