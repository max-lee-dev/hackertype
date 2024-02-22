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
  const yPos = elem.offsetTop - window.scrollY;

  if (letter > maxLength) {

    const x = elem.offsetLeft + elemRect.width + 1;
    const y = yPos;
    return {x, y};
  }

  if (isLast) {
    const x = elem.offsetLeft + elemRect.width - 8;
    const y = yPos;
    return {x, y};
  }

  if (letter === "0") {
    const x = elem.offsetLeft - 1;
    const y = yPos;

    return {x, y};
  }


  const x = elem.offsetLeft;
  const y = yPos;


  return {x, y};
}
