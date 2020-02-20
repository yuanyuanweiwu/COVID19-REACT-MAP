export function changeMapData(list) {
  let finalList = [];
  list.forEach(element => {
    let item = {
      name: element.provinceShortName,
      value: element.confirmedCount,
      ...element
    };
    finalList.push(item);
  });
  return finalList
}
