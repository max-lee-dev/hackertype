export function coordinatesOfChar(id, maxLength) {
  let idName = id;
  const letter = idName.split("-")[1];


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

export async function discordWebhook(username, message) {
  const webhook =
    "https://discord.com/api/webhooks/1254165998416691302/6sZZ8pirBnK1bh5I4Q6G7L92SzX1sHJpDgbSTF32fLjMDRCS0ZMCH8rf8UKI_Dh-48zt";
  await fetch(webhook, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
      username: `${username}`, // email of person uploading
    }),
  });
}
