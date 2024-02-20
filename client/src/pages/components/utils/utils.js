export function coordinatesOfChar(id, maxLength) {
  let idName = id;
  const letter = idName.split("-")[1];

  console.log(idName, letter, maxLength)

  const windowH = window.innerHeight;
  const isLast = parseInt(letter) >= parseInt(maxLength);


  if (isLast) {

    idName = idName.split("-")[0] + "-" + (maxLength - 1);

  }

  const elem = document.getElementById(idName);
  const elemRect = elem?.getBoundingClientRect();
  if (!elemRect) return 0;
// couldn't get parent - child, so i resorted to scroll
  // but realized, if you scroll a lil then its offset obviously
  // this is a scuffed way to get the height of the element with minimum offset if you scroll too far
  const scuffedHeight = windowH - (windowH - (window.scrollY + elem.offsetTop)) - 1;

  if (letter > maxLength) {

    const x = elem.offsetLeft + elemRect.width + 1;
    const y = scuffedHeight;
    return {x, y};
  }

  if (isLast) {
    const x = elem.offsetLeft + elemRect.width - 8;
    const y = scuffedHeight;
    return {x, y};
  }

  if (letter === "0") { // lol why do i have to add 2? I have no clue!! But whatever
    const x = elem.offsetLeft - 1;
    const y = scuffedHeight;

    return {x, y};
  }


  const x = elem.offsetLeft;
  const y = scuffedHeight;


  return {x, y};
}
