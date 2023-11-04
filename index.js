const express = require("express");
const fs = require("fs");
const listUsers = require("./data/listUser.json");
const { request } = require("http");
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
  } else {
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

app.put("/api/users/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let payload = req.body;

  if (!payload.name) {
    const resGagal = {
      status: "EROR",
      message: "erro 400 Bad Request - Nama harus disertakan",
      data: {
        users_update: null,
      },
    };
    res.status(400).send(resGagal);
  } else {
    const userToUpdate = listUsers.find((user) => user.id === id);

    if (userToUpdate) {
      userToUpdate.name = payload.name;

      const response = {
        status: "OK",
        message: "Sukses Untuk memperbarui data user",
        data: {
          users: userToUpdate,
        },
      };

      fs.writeFileSync("./data/listUser.json", JSON.stringify(listUsers));

      res.status(200).send(response);
    } else {
      const resGagal = {
        status: "ERROR",
        message: "404 Not Found - User tidak ditemukan",
        data: {
          users_update: null,
        },
      };
      res.status(404).send(resGagal);
    }
  }
});

app.delete("/api/users/:id", (req, res) => {
  const userIdDelete = listUsers.filter(
    (user) => user.id !== parseInt(req.params.id)
  );

  const response = {
    status: "OK",
    message: "Berhasil Menghapus user",
    data: {
      users: listUsers.filter((user) => user.id !== parseInt(req.params.id)),
    },
  };

  const resGagal = {
    status: "EROR",
    message: "erro 404 not found",
    data: {
      users: null,
    },
  };

  if (userIdDelete !== -1) {
    res.send(response);
    fs.writeFileSync("./data/listUser.json", JSON.stringify(userIdDelete));
  } else {
    res.status(404).send(resGagal);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
