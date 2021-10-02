const express = require("express");
const nodemailer = require("nodemailer");

/**
 * Set this flag to true to enter debug mode.
 * Entering debug mode will resut in the server writing some
 * extra responses in some http requests for debugging and
 * testing purpose.
 * Set this flag to false at deploy time.
 */
const debug_mode = true;

const server = express();
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "studyfindtesting@gmail.com",
    pass: "main(args[])",
  },
});

let codes = new Map();

// Scheduled time out function to delete email
const expire_time = 300000;
const remove = (email) => {
  const addedTime = codes.get(email).time;
  const currentTime = new Date().getTime();

  if (currentTime - addedTime >= expire_time) {
    codes.delete(email);
  }
};

// server.get("/", (req, res) => {
//   const test = {
//     test: "test",
//   };
//   res.write(JSON.stringify(test));
//   res.end();
// });

// Server functions
server.get("/get_code", (req, res) => {
  const email = req.query.email;
  console.log(req);
  const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

  mailOptions = {
    from: "studyfindtesting@gmail.com",
    to: email,
    subject: "StudyFind Medical Database Account Registration",
    text: "Your verification code is: " + String(code),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
    }
  });

  const email_code_entry = {
    code: code,
    time: new Date().getTime(),
  };
  codes.set(email, email_code_entry);

  // Schedule callback to delete this entry after 5 minutes
  setTimeout(remove, expire_time + 1000, email);

  // response values for debug
  if (debug_mode) res.write(JSON.stringify(email_code_entry));
  res.end();
});

server.get("/verify", (req, res) => {
  const email = req.query.email;
  const code = req.query.code;

  if (!codes.has(email)) {
    const error_msg = {
      verified: false,
      reason: "email not recognized",
      message: "Code may have expired, please resend code and try again.",
    };
    res.write(JSON.stringify(error_msg));
    res.end();
  } else {
    const expected_code = codes.get(email).code;
    const msg =
      expected_code == code
        ? {
            verified: true,
          }
        : {
            verified: false,
            reason: "wrong code",
            message: "wrong code",
          };

    res.write(JSON.stringify(msg));
    res.end();
  }
});

instance = server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

module.exports = {
  instance: instance,
  codes: codes,
}; // For testing purpose
