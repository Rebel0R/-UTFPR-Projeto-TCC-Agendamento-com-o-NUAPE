const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const logoutRoutes = require("./routes/logout");
const accountRoutes = require("./routes/account");
const professionalRoutes = require("./routes/professional");
const sessionsRoutes = require("./routes/session");

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/account", accountRoutes);
app.use("/professionals", professionalRoutes);
app.use("/session", sessionsRoutes);

app.listen(3000, () => {
  console.log("Servidor foi iniciado");
});
