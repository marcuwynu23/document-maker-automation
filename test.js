const fs = require("fs").promises;

(async function () {
  try {
    const database = await fs.readFile("database.txt", "utf8");
    const data = database.trim().split("\n");
    console.log(data[0].split("."));
  } catch (error) {
    console.error(error);
  }
})();
