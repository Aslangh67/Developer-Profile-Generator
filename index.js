const fs=require("fs");
const inquirer=require("inquirer");
const axios=require("axios");
const util=require("util");
const writeFileAsync = util.promisify(fs.writeFile);
function userInput(){
    return inquirer.prompt([
       {
           type: "input",
           message: "What is your full name?",
           name: "name"
         },
    {
        type: "input",
        message: "What is your Github username?",
        name: "username"
      },
    {
        type: "input",
        message: "What is your blog url?",
        name: "blog"
      },
    {
        type: "input",
        message: "In what city do you live?",
        name: "location"
      },
    {
        type: "input",
        message: "Please provide a short bio.",
        name: "bio"
      },
    {
        type: "input",
        message: "What color would you like as your PDF file background?",
        name: "color"
      },
   ])

}
function generateHTML(answers) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <title>Document</title>
  </head>
  <body>
    <div class="jumbotron jumbotron-fluid">
    <div class="container">
      <h1 class="display-4">Hi! My name is ${answers.name}</h1>
      <p class="lead">I am from ${answers.location}.</p>
      <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
      <ul class="list-group">
        <li class="list-group-item">My GitHub username is ${answers.github}</li>
        <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
      </ul>
    </div>
  </div>
  </body>
  </html>`;
  }
userInput()
.then(function(answers){
    const html = generateHTML(answers);

    return writeFileAsync("index.html", html);
})
.catch(function(err){
    console.log(err);
    
})