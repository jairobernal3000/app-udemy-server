const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");

function signUp(req, res) {
  const user = new User();

  const { name, lastName, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.role = "admin";
  user.password = password;
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "las contraseñas son obligatorias" });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "las contraseñas no coinciden" });
    } else {
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res.status(500).send({ message: "Error al encriptar la contraseña" });
        } else {
          user.password = hash;

          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({
                message: "Error save server. " + err.code,
              });
              //res.status(500).send({ message: err });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el usuario" });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });

      //res.status(200).send({ message: "Usuario Creado" });
    }
  }
}

module.exports = {
  signUp,
};
