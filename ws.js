const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('electron'));

app.listen(port, console.log("Hi hdgamer"))