const inquirer = require("inquirer");
const axios = require("axios");
const util = require("util");
const fs = require('fs');
const pdf = require('html-pdf');
var gs = require('github-scraper');
const writeFileAsync = util.promisify(fs.writeFile);
function userInput() {
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
      type: "list",
      message: "What color would you like as your PDF file background?",
      name: "color",
      choices: [
        "Red",
        "Blue",
        "Grey"
      ]
    },
  ])

}
function generateHTML(answers, userData) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        <title>Document</title>
    </head>
    <body>
        
        <div class="jumbotron">
        <img src="${userData.githubPic}" class="rounded mx-auto d-block" alt="${answers.name}'s picture">
            <h1 class="display-4">${answers.name}</h1>
            <p class="lead">I'm from ${answers.location}.</p>
            <h3 class="lead">${answers.bio}.</h3>
            <h2 class="lead">Number of github repos: ${userData.githubRepos}</h2>
            <h2 class="lead">Number of github followers: ${userData.githubFollowers}</h2>
            
            <hr class="my-4">
            <p>Here are the ways you can reach me.</p>
            <a class="btn btn-primary btn-lg" href="LINKEDIN" role="button" target="blank">Linkedin</a>
            <a class="btn btn-primary btn-lg" href="${userData.githubURL}" role="button" target="blank">github</a>
          </div>
    
    
    
    
    
        <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    </body>
    </html>`;
}
 function githubAxiosProfile(answers) {
    const queryUrl = `https://api.github.com/users/${answers.username}`;
    return axios.get(queryUrl)
  }
  async function pdfGen(html) {
 
    const options = { format: 'Letter', orientation: "portrait", zoomFactor: ".8",};
    pdf.create(html, options).toFile('./profile.pdf', function(err, res) {
      if (err) return console.log(err);
      console.log(res); 
    });
  }
  async function main(){
    try{
      const answers=await userInput()
      const res= await githubAxiosProfile(answers)
      var url = answers.username 
      gs(url, function(err, data) {
        console.log(data.following); 
        console.log(data.stars); 
      })
      const userData = {
            githubURL: res.data.html_url,
            githubPic: res.data.avatar_url,
            githubRepos: res.data.public_repos,
            githubFollowers: res.data.followers
      }
      const html= generateHTML(answers, userData)
      writeFileAsync("index.html", html)
     pdfGen(html)
    }
    catch(err){
      console.log(err);
    }
  }
main()
