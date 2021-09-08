const express = require("express");
const nodemailer = require('nodemailer');

const server = express();
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'studyfindtesting@gmail.com',
     pass: 'main(args[])'
   }
 });

let codes = new Map();

// Server functions
server.get('/get_code', (req, res) => {
   const email = req.query.email;
   const code = Math.floor(Math.random()*(999999-100000+1)+100000);
   mailOptions = {
      from: 'studyfindtesting@gmail.com',
      to: email,
      subject: 'StudyFind Medical Database Account Registration',
      text: String(code)
   };

   transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
      }
    });

   codes.set(email, 
      {
         code: code,
         time: new Date().getTime()
      });

   // Schedule callback to delete this entry after 5 minutes
   setTimeout((email) => {
      _, addedTime = codes[email];
      const currentTime = new Date().getTime();
      if (currentTime - addedTime >= 300000) {
         codes.delete(email);
      }
   }, 305000);

   res.end();
});


instance = server.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});

module.exports = {
   instance: instance, 
   codes: codes}; // For testing purpose