document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("button");
    const textResponse = document.querySelector("#textResponse");
    const roundResult = document.createElement("p");
    textResponse.appendChild(roundResult);
    const roundSummary = document.createElement("p");
    textResponse.appendChild(roundSummary);
    const endingText = document.createElement("p");
    textResponse.appendChild(endingText);


function getComputerChoice(){
    let z = Math.random();
    if (z < 0.33){
        return "rock";
    }
    else if (z > 0.66){
        return "scissors";
    }
    else {
        return "paper";
    }
}

let humanScore = 0;
let computerScore = 0;

function playRound(humanSelection,computerSelection){
if (humanSelection == computerSelection){
    return "We tie!";
}

if (humanSelection =="rock"){
    if (computerSelection =="scissors")
    {
        humanScore = humanScore + 1;
        return "You win! " + humanSelection +" beats " + computerSelection + "";
    }


    if (computerSelection =="paper")
    {
        computerScore = computerScore + 1;    
        return "You lose! " + computerSelection +" beats " + humanSelection + "";
    }
}

if (humanSelection =="paper"){
    if (computerSelection =="scissors")
    {
        computerScore = computerScore + 1; 
        return "You lose! " + computerSelection +" beats " + humanSelection + "";
    }


    if (computerSelection =="rock")
    {
        humanScore = humanScore + 1;
        return "You win! " + humanSelection +" beats " + computerSelection + "";
  
    }
    }

if (humanSelection =="scissors"){
    if (computerSelection =="rock")
    {
        computerScore = computerScore + 1; 
        return "You lose! " + computerSelection +" beats " + humanSelection + "";
       
    }


    if (computerSelection =="paper")
    {
        humanScore = humanScore + 1;   
        return "You win! " + humanSelection +" beats " + computerSelection + "";
    
    }
}
}

let i = 0;
function playGame(){
        buttons.forEach((button) => {
        button.addEventListener("click", () => {
        let humanSelection = button.id;
        let computerSelection = getComputerChoice();
        let result = playRound(humanSelection,computerSelection);
        let ending = matchEnd();
        
        if(result == "We tie!"){
            i = i + 1;
        roundResult.textContent =`${result} ${i}`;

        }
        
        roundSummary.textContent =`You chose ${humanSelection}.  The computer chose ${computerSelection} \n. The score is YOU: ${humanScore} COMPUTER: ${computerScore}`;
        matchEnd();
        endingText.textContent = `${ending}`;
        });
});
}

function matchEnd() { 
    if (humanScore < 5 && computerScore < 5){
        return "ROUND COMPLETE. CONTINUE UNTIL ONE PLAYER REACHES 5 WINS";}
    if(humanScore > computerScore && humanScore >= 5){
    buttons.forEach(button => button.disabled = true);
    return"You won the match " + humanScore + " to " + computerScore + "! Refresh the page to play again";}

    else if(humanScore < computerScore && computerScore >= 5){
    buttons.forEach(button => button.disabled = true);
    return"You lost the match " + humanScore + " to " + computerScore + "! Refresh the page to try again.";}

}

playGame();

});