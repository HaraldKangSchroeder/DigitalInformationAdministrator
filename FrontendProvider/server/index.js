const express = require("express");
const { configs } = require("./configs");
// const cors = require("cors");

const app = express();
// app.use(cors());

// the public folder contains the build versions of respective react apps. Those build folders have an index.html, thus they will used as response automatically
// -> no need to use app.get(...) afterwards
app.use(express.static(__dirname + "/public"));

var port = process.env.SERVER_PORT || configs.port;

app.listen(port, () => {
    console.log(`Server starts running on port ${port}`);
});
