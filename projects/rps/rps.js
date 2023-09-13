rockElem = document.querySelector('.js-rock');
rockElem.addEventListener('click',()=>{evaluateMove('rock')});

paperElem = document.querySelector('.js-paper');
paperElem.addEventListener('click',()=>{evaluateMove('paper')});

scissorElem = document.querySelector('.js-scissor');
scissorElem.addEventListener('click',()=>{evaluateMove('scissor')});

document.body.addEventListener('keydown',(event)=>{evaluateKey(event.key)});

function evaluateKey(key){
    if(key==='r') evaluateMove('rock');
    else if(key==='p') evaluateMove('paper');
    else if(key==='s') evaluateMove('scissor');
}

let stats = JSON.parse(localStorage.getItem('stats')) || {
    'wins':0,
    'loses':0,
    'ties':0
}; 
document.querySelector('.js-stats').innerHTML=`Wins: ${stats.wins}, Losses: ${stats.loses}, Ties: ${stats.ties}`;
console.log(stats);
function pickComputerMove(){
    let rand = Math.floor(Math.random()*3);
    if(rand==1) {return 'rock'}
    else if(rand==2){return 'paper'}
    else return 'scissor';
}
function evaluateMove(human){
    let computer = pickComputerMove();
    let heading = '';
    let description = `You ${human} - ${computer} Computer`;
    if(computer===human){heading = 'Match tied';stats.ties+=1}
    else if((computer==='rock' && human==='scissor') || (computer==='paper' && human==='rock') || (computer==='scissor' && human==='paper')){heading = 'Computer Won';stats.loses+=1}
    else {heading = 'You Won';stats.wins+=1}
    console.log(stats);
    localStorage.setItem('stats',JSON.stringify(stats));
    document.querySelector('.js-win').innerHTML = heading;
    document.querySelector('.js-description').innerHTML = description;
    document.querySelector('.js-stats').innerHTML = `Wins: ${stats.wins}, Losses: ${stats.loses}, Ties: ${stats.ties}`;
}
function reset(){
    stats.wins = 0;
    stats.loses = 0;
    stats.ties = 0;
    localStorage.removeItem('stats');
    document.querySelector('.js-stats').innerHTML = `Wins: ${stats.wins}, Losses: ${stats.loses}, Ties: ${stats.ties}`;
}

isAutoPlaying = false;

let intervalId;

function autoPlay(){
    if(!isAutoPlaying){
        isAutoPlaying = true;
        document.querySelector('.js-autoPlay').innerHTML = 'Stop Play';
        intervalId = setInterval(function(){evaluateMove(pickComputerMove())},1000);
    }
    else{
        clearInterval(intervalId);
        isAutoPlaying=false;
        document.querySelector('.js-autoPlay').innerHTML = 'Auto Play';
    }
}
