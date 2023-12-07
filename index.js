const { Pool } = require("@yugabytedb/pg");

const pool = new Pool({
  user: "yugabyte",
  host: "127.0.0.1",
  database: "yugabyte",
  password: "yugabyte",
  port: 5433,
  max: 10,
  idleTimeoutMillis: 0,
});
async function start() {
  const usersResponse = await pool.query("SELECT * from users;");
  const users = usersResponse?.rows;
  console.log("Users: ", users);

  const productsResponse = await pool.query("SELECT * from products;");
  const products = productsResponse?.rows;
  console.log("Products: ", products);

  setInterval(async () => {
    try {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      const insertResponse = await pool.query(
        "INSERT INTO orders(user_id, product_id, quantity, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [randomUser?.id, randomProduct?.id, 1, "processing"]
      );

      console.log("Insert Response: ", insertResponse?.rows?.[0]);
    } catch (e) {
      console.log(`Error while inserting order: ${e}`);
    }
  }, 50);
}

start();
