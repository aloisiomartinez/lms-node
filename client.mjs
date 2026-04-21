const base = "http://localhost:3000";

setTimeout(async () => {
  const response = await fetch(base + "/curso/javascript/pegar");
  console.log(response.ok, response.status);

  const response2 = await fetch(base + "/");
  console.log(response2.ok, response2.status);
}, 200);
