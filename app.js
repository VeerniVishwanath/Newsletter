const express = require("express");
const app = express();

const client = require("@mailchimp/mailchimp_marketing");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const email = req.body.Email;
  const fname = req.body.Fname;
  const lname = req.body.Lname;

  client.setConfig({
    apiKey: "a970fa217d44725a4bac718e920e4d49",
    server: "us11",
  });

  const run = async () => {
    try {
      const response = await client.lists.batchListMembers("c4872b8f39", {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: fname,
              LNAME: lname,
            },
          },
        ],
      });
      res.sendFile(__dirname + "/success.html");
    } catch (error) {
      var errorCode = error.response.body.status;
      var errorDetail = error.response.body.detail;
      res.render("failure", { errorCode: errorCode, errorDetail: errorDetail });
    }
  };

  run();
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});
