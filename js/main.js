let correctAnswer =[];
function getQuestions() {
    const container = document.getElementById('container-cards');
    container.innerHTML = ' ';
    const questionsQuantity = document.getElementById('questions-number').value
    const difficult = document.getElementById('questions-difficult').value
    const type = document.getElementById('questions-type').value
    const category = document.getElementById('questions-category').value
    fetch(retunrURL(questionsQuantity,difficult, type, category))
        .then(response => response.json())
        .then(data => {
            if(data.response_code == 0){
                printCards(data.results,container)
            }else {
                alert("Sin preguntas")
            }
        })
    correctAnswer =[];
    
}
function printCards(questions,container) {
    questions.forEach((question,index) => {
        const card = returnCardHTML(question,index);
        container.innerHTML += card;
    });
    container.innerHTML += `<button type="submit" class="btn btn-primary" onclick="event.preventDefault(), getAnswers()">Submit</button>`
    
   
}
function getCategoires() {
    fetch(`https://opentdb.com/api_category.php`)
    .then(response => response.json())
    .then(data => returnCategoriesHTML(data.trivia_categories))
}
//Categorias
function returnCategoriesHTML(c) {
    const container = document.getElementById('category');
    const select = `<div class="form-group">
                    <label for="questions-category">Eige una categoria</label>
                    <select onchange="getQuestions()" class="form-control" id="questions-category">
                      <option value="">mix up</option>
                      ${retunrOptions(c)}
                    </select>
                </div>`
    container.innerHTML = select;
}
function retunrOptions(categories){
    let options = '';
    categories.forEach((category) => {
        options += `<option value="${category.id}">${category.name}</option>`;
    })
    return options;
}

// ERICK CODE
function returnCardHTML(q,indexCard) {
    const card = `<div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${q.category}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${q.question}</h6>
                        ${returnAnswersHTML(q.correct_answer,q.incorrect_answers, indexCard)}           
                    </div>
                </div>`
    return card;
}


function returnAnswersHTML(correct, incorrects,questionId) {
    correctAnswer.push(correct)
    incorrects.splice(getRandomInt(0,4),0,correct)
    let incorrectHTML = '';
    incorrects.forEach((incorrect,index) => {
        incorrectHTML += `<div class="form-check">
                            <input class="form-check-input" type="radio" name="question_${questionId}" id="answer-${questionId}-${index}" value="${incorrect}">
                            <label class="form-check-label" for="answer-${questionId}-${index}">
                            ${incorrect}
                            </label>
                        </div>`;
    })
    
    return incorrectHTML
}
function retunrURL(questionsQuantity,difficult, type, category){
    let url = `https://opentdb.com/api.php?amount=${questionsQuantity}&type=${type}`;
    if(category != ''){
        url += `&category=${category}`;
    }
    if(difficult != ''){
        url += `&difficulty=${difficult}`;
    }
    return url;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getAnswers(){
    let answersUser =[];
    let trivia = document.getElementById('questions-number').value;
    for(let i=0; i <trivia;i++){
        let question = document.getElementsByName(`question_${i}`)
        for(let j=0;j<question.length;j++){
            let select = document.getElementById(`answer-${i}-${j}`);
            if(select.checked){
                answersUser.push(select.value)
            }
        }
    }
    getScore(answersUser,correctAnswer)
}
function getScore(userAns,correctAns){
    const trivia =document.getElementById('questions-number').value;
    if(userAns.length == trivia){
        let score=0;
        for(let i=0;i< trivia;i++){
            if(userAns[i] == correctAns[i]){
                score++;
            }
        }
        alert("Tu puntaje es:" + ((score/trivia)*100).toFixed(1))
    }else{
        alert("Te faltan preguntas por Responder");
        userAns = [];
    }
    
}
getCategoires();