export function coordinatesOfChar(id) {
  const idName = id;
  if (document.body === null) return;
  const bodyRect = document?.body?.getBoundingClientRect();
  const elemRect = document.getElementById(idName)?.getBoundingClientRect();
  if (!elemRect) return 0;
  const x = elemRect.left - bodyRect.left;
  const y = (elemRect.top = bodyRect.top);
  return { x, y };
}
