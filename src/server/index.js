let express = require("express");
let app = express();

app.get("/", (req,res) => {
    res.send("testing");
});

app.get("/profile", (req,res) => {
    res.status(404).end("wot");
});

let server = app.listen(8080, () => {
    console.log('Express listening on 8080');
});