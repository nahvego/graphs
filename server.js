const express = require("express");

const app = express();

app.use(express.static("."));

app.listen(process.argv[2] || 7777, function() {
    console.log(`Running ${process.argv[2] || 7777}`);
})