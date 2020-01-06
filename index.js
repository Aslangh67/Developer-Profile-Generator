const inquirer = require("inquirer");
const axios = require("axios");
const util = require("util");
const fs = require('fs');
const pdf = require('html-pdf');
var gs = require('github-scraper');
const writeFileAsync = util.promisify(fs.writeFile);
let github;
function userInput() {
  return inquirer.prompt([
  
    {
      type: "input",
      message: "What is your Github username?",
      name: "username"
    },
    {
      type: "list",
      message: "What color would you like as your PDF file background?",
      name: "color",
      choices: [
        "alert",
        "info",
        "secondary"
      ]
    },
  ])
}
function generateHTML(answers, userData,github) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        <title>Document</title>
        <style>
        .jumbotron {
            color: black;
            background: white;
            text-align: center;
        }
        img{
            box-shadow:0px 0px 50px 30px black;
            border-radius: 50%;
        }
        h1, p, h2, h3{
            text-shadow:2px 2px 5px black;
        }
    </style>
    </head>
    <body>
        
        <div class="jumbotron bg-${answers.color}">
        <img src="${userData.githubPic}" class="rounded-circle mx-auto d-block mb-5" alt="${answers.name}'s picture">
            <h1 class="display-4">${userData.githubName}</h1>
            <p class="lead">I'm from ${userData.githubLocation}.</p>
            <h3 class="lead">${userData.githubBio}.</h3>
            <h2 class="lead">Number of github repos: ${userData.githubRepos}</h2>
            <h2 class="lead">Number of github followers: ${userData.githubFollowers}</h2>
            <h2 class="lead">Number of github following: {github.following}</h2>
            <h2 class="lead">Number of github stars: {github.stars}</h2>
            
            <hr class="my-4">
            <p>Here are the ways you can reach me.</p>
            <a class="btn btn-primary btn-lg" href="https://www.google.com/maps/place/${userData.githubLocation}/" role="button" target="blank">Location</a>
            <a class="btn btn-primary btn-lg" href="${userData.githubURL}" role="button" target="blank">github</a>
            <a class="btn btn-primary btn-lg" href="${userData.githubBlog}" role="button" target="blank">Blog</a>
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
 
    const options = { format: 'Letter', orientation: "portrait",};
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
        github={
       following: data.following,
        stars:data.stars 
      }
      })
      const userData = {
            githubURL: res.data.html_url,
            githubPic: res.data.avatar_url,
            githubRepos: res.data.public_repos,
            githubFollowers: res.data.followers,
            githubLocation: res.data.location,
            githubBlog: res.data.blog,
            githubName: res.data.name,
            githubBio: res.data.bio
      }
      
      
      const html= generateHTML(answers, userData, github)
      writeFileAsync("index.html", html)
     pdfGen(html)
    }
    catch(err){
      console.log(err);
    }
  }
main()
