const readlineSync = require('readline-sync');
const chalk = require('chalk');
const boxen = require('boxen');

//not used database...
// const Datastore = require('nedb')
// const highscores = new Datastore({filename: 'highscores.db', autoload: true});
// highscores.loadDatabase()


//current score
let score = 0;

//hardcoded scoreboard
let scoreBoard = [
  {name: "sk", score: 51},
  {name: "t1", score: 39},
  {name: "t2", score: 29},
  {name: "t3", score: 19},
  {name: "t4", score: 9}
];

//hardcoded questions array
const questions = [
  { question: "My last name is Kuruvilla.", answer: "t"},
  { question: "I am from Delhi.", answer: "t"},
  { question: "Currently a final year CSE student.", answer: "t"},
  { question: "I want to work as a frontend developer.", answer: "t"},
  { question: "I love designing stuff and reading books.", answer: "t"}
];

function clg(value) {
  console.log(value);
}


//intro string
clg(`Hi! My name's ${chalk.bold.cyanBright("Shobhit")}\n\nWelcome to this \"${chalk.yellowBright.underline("DO YOU KNOW ME?")}\" quiz`);

//input users name
const userName = readlineSync.question(chalk.yellow('\nMay I have your name?.. '));

clg(chalk.cyan(`${chalk.bold("Great")} to have you here ${chalk.italic.blueBright(userName)}. Let us begin!\n\n`));


//print instructions
clg(boxen(`\nThere will be ${chalk.yellow("5")} ${chalk.underline("true/false")} questions\n\nYou can ans with ${chalk.red("t (true)")} and ${chalk.green("f (false)")}\n\n${chalk.italic.bold.underline("correct answer")} ➔ ${chalk.italic.bold.underline("+10 points")}\n`, { align: "center"}));

const cont = readlineSync.keyIn("  press any letter to continue..");
console.clear();


//print score
clg(`\n\n ${chalk.underline("Score")}: ${score}\n`);




//function to re-render the score dyn
function renderScore() {
  clg(`\n\n ${chalk.underline("Score")}: ${score}\n`);
}


//function to re-render the quiz component
function renderWhole(question, userAnswer, i) {
  //re-render score
  renderScore();
  clg(boxen(`               Question ${i+1}:               `, { borderColor: "black", backgroundColor: "#006663", dimBorder: true}));
  clg(`  ${question} \n\n  ${chalk.cyan.underline("Answer")}${chalk.cyanBright("(t/f)")}: ${chalk.white(userAnswer)}`);
  clg(boxen(`              ${chalk.black.bold("CORRECT")}              `, { borderColor: "black", backgroundColor: "#0ff702", dimBorder: true, padding: 1}));
}



//play each quiz
function quiz(question, answer, i) {
  //not to re-render on fisrt q
  if( i !== 0) {
    renderScore();
  }


  clg(boxen(`               Question ${i+1}:               `, { borderColor: "black", backgroundColor: "#006663", dimBorder: true}));
  const userAnswer = readlineSync.keyIn(`  ${question} \n\n  ${chalk.cyan.underline("Answer")}${chalk.cyanBright("(t/f)")}: `, {limit: "tf"});
  
  //correct ans
  if(userAnswer.toLowerCase() === answer.toLowerCase()) {
    clg(boxen(`              ${chalk.black.bold("CORRECT")}              `, { borderColor: "black", backgroundColor: "#0ff702", dimBorder: true, padding: 1}));
    score += 10;
    console.clear();
    renderWhole(question, userAnswer, i);
  }
  //wrong ans
  else {
    clg(boxen(`               ${chalk.black.bold("WRONG")}               `, { borderColor: "black", backgroundColor: "#f73702", dimBorder: true, padding: 1}));
  }
  let cont = readlineSync.keyIn("  press any letter to continue..");
  //clear display
  console.clear();
}

//loop through the quiz questions
questions.forEach((q, i)=> {
  quiz(q.question, q.answer, i);
});

//end msg
clg(`The quiz has ${chalk.yellow("ended")}.`)
clg(boxen(`Your final score is: ${chalk.cyanBright(score)}`, { borderColor: "#02eff7", padding: 1}));


//compare score to check if highscore broken, and run displayScoreBoard
function compareScore() {
  let flag = false;
  //check if highscore broken
  for(let i = 0; i < scoreBoard.length; i++) {
    if(scoreBoard[i].score < score) {
      flag = true;
      break;
    }
  }
  //if yes then update and display scoreboard else just display 
  if (flag) {
    if (scoreBoard.length === 5) {
      scoreBoard.sort(function(a, b) {
        return b.score - a.score;
      })
      scoreBoard.pop()
    }
    
    let highscore = {"name": userName, "score": score}
    scoreBoard.push(highscore)

    clg(chalk.green(`Congratulations! You have a new highscore.\n`));
    displayScoreBoard();

    
  } else {
    clg(chalk.red(`You couldn't beat the highscore. Better luck next time!\n`));
    displayScoreBoard()
  }
}

//display the scoreboard 
function displayScoreBoard() {
  //sort scoreboard
  scoreBoard.sort(function(a, b) {
    return b.score - a.score;
  })
  clg(chalk.yellow("Current Scoreboard:\n"))
  
  clg(chalk.underline.inverse.italic(`    Name             Score       `));
  for(player of scoreBoard) {
    let len = player.name.length;
    let tempName = player.name;
    let tempScore = player.score;

    //align the name in the center
    tempName = " ".repeat((16-len)/2) + tempName + " ".repeat((16-len)/2) + " ".repeat(len % 2 === 0 ? 0 : 1 );
    //align the score in the center
    if(tempScore > 9) { 
      tempScore =" ".repeat(7) + tempScore + " ".repeat(7);
    }
    else {
      tempScore =" ".repeat(8) + tempScore + " ".repeat(7);
    }
    
    //highlight on scoreboard if player broke the highscore
    if(player.name === userName && player.score === score) { 
      clg( chalk.underline.green(`${(tempName)}|${(tempScore)}`));  
    }
    else {
      clg( chalk.underline(`${(tempName)}|${(tempScore)}`));
    }
  }
}
compareScore();