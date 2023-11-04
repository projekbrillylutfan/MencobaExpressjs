const express = require("express");
const fs = require("fs");
const listUsers = require("./data/listUser.json");
const app = express();
app.use(express.json());

const PORT = 8080;

app.get("/api/users", (req, res) => {
  const nameQuery = req.query.name;
  const nameQueryLowerCase = nameQuery.toLowerCase();

  const response = {
    status: "OK",
    message: "Sukses Untuk menampilkan data user",
    data: {
      users: listUsers.filter((user) =>
        user.name.toLowerCase().includes(nameQueryLowerCase)
      ),
    },
  };

  res.send(response);
});

app.get("/api/users/:id", (req, res) => {
  const user = listUsers.find((user) => user.id === parseInt(req.params.id));

  const response = {
    status: "OK",
    message: "Sukses Untuk menampilkan data user",
    data: {
      users: user,
    },
  };

  const resGagal = {
    status: "EROR",
    message: "erro 404 not found",
    data: {
      users: null,
    },
  };

  if (user) {
    res.send(response);
  } else {
    res.status(404).send(resGagal);
  }
});

app.post("/api/users", (req, res) => {
  const payload = req.body;

  if (!payload.name) {
    const resGagal = {
      status: "EROR",
      message: "erro 404 not found",
      data: {
        users_create: null,
      },
    };
    res.status(400).send(resGagal);
  } 
  else {
    const userToCreate = {
      id: listUsers[listUsers.length - 1].id + 1,
      name: payload.name,
    };

    const response = {
      status: "OK",
      message: "Sukses Untuk menambahkan data user",
      data: {
        users: userToCreate,
      },
    };

    listUsers.push(userToCreate);

    fs.writeFileSync("./data/listUser.json", JSON.stringify(listUsers));

    res.status(201).send(response);
  }
});

app.put("/api/users/:id", (req, res) => {});

app.delete("/api/users/:id", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
