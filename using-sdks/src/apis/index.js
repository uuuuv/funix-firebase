const baseUrl = process.env.REACT_APP_BASE_URL;
console.log(baseUrl);

export const rename = (originRef, destinationRef) =>
  fetch(baseUrl + "/file/rename", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originRef,
      destinationRef,
    }),
  });
