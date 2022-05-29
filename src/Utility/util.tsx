export default function equals(a:any, b:any): boolean {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
}

export function calcCategories( category : number) : Array<string>{
  let result : Array<string> = [];
  let value: number = 0;
  while(category !== 0){
    value ++;
    if(category % 2 === 1){
      result.push(value.toString());
    }
    category = Math.floor(category / 2);
  }
  return result;
}

export function calcCategory(categoryList: Array<string>) :number{
  let result:number = 0;
  categoryList.forEach( category => result += Math.pow(2,  parseInt(category)-1));
  return result;
}

export function getCategoryNamesByIds (categoryIdLists : Array<string>, categoryIdName :Array<Category>) : Array<string>{
  let result : Array<string> = [];
  categoryIdLists.forEach(categoryId => result.push(categoryIdName[parseInt(categoryId) - 1].name));
  return  result;
}

export function getCategoryIdsByNames (categoryNameLists : Array<string>, categoryIdName :Array<Category>) : Array<string>{
  let result : Array<string> = [];
  categoryNameLists.forEach((categoryName: string) => {
    categoryIdName.forEach(category => {
      if(category.name === categoryName){
        result.push(category.categoryId.toString());
      }
    })
  });
  return  result;
}

export const defaultImageUrl : string = "http://www.aaru.edu.jo/websites/aaru2/wp-content/plugins/learnpress/assets/images/no-image.png?Mobile=1&Source=%2F%5Flayouts%2Fmobile%2Fdispform%2Easpx%3FList%3D78b536db%252De7c7%252D45d9%252Da661%252Ddb2a2aa2fbaf%26View%3D6efc759a%252D0646%252D433c%252Dab6e%252D2f027ffe0799%26RootFolder%3D%252Fwebsites%252Faaru2%252Fwp%252Dcontent%252Fplugins%252Flearnpress%252Fassets%252Fimages%26ID%3D4786%26CurrentPage%3D1";

export function formatDate(date : Date) :string{
  return date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
}