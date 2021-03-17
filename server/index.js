const express = require("express");
const app = express();

app.use(express.json());

const port = PORT || 8080;
app.listen(port, () => {
    console.log(`The App is alive on - http://localhost:${port}`)
})