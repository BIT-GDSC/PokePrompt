const systemPrompt = document.querySelector("#prompt");
const gptOutput = document.querySelector("#response");
const userPrompt = document.querySelector("#prompt-input");
const submitBtn = document.querySelector("#submit-btn");
const confirmSubmitBtn = document.querySelector("#confirm-submit-btn");
const pokeball = document.querySelector(".desk-ball");
const lvlNum = document.querySelector("#level-num");
const learderboardBtn = document.querySelector(".leaderboard-btn");
const table = document.querySelector("#table");
const shareButton = document.querySelector(".desk-share");
const pokeCard = document.querySelector("#poke-card")
const sharePokeCardBtn = document.querySelector("#share-pokecard-btn");
const downloadPokeCard = document.querySelector("#download-pokecard");


const speed = 50;


let level = JSON.parse(localStorage.getItem("metadata")).level;


function levelpp() {
    const metadata = JSON.parse(localStorage.getItem("metadata"));
    metadata.level += 1;
    localStorage.setItem("metadata", JSON.stringify(metadata));
}

function typeWriter(txt, i = 0) {
    if (i < txt.length) {
        gptOutput.value += txt.charAt(i);
        i++;
        setTimeout(() => typeWriter(txt, i), speed);
    }
}


function fetchSystemPrompt(url) {
    lvlNum.innerHTML = level;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            console.log(data);
            systemPrompt.value = data.sys_prompt;
        } else {
            console.error('Network response was not ok');
        }
    };

    xhr.onerror = function() {
        console.error('Error fetching data:', xhr.statusText);
    };

    xhr.send();
}





function submitPrompt(prompt = "hi") {

    const userID = JSON.parse(localStorage.getItem("responseData")).user_id;
    console.log(userID)
    const metadata = JSON.parse(localStorage.getItem("metadata"));
    const lvlString = `level_${level}`;
    console.log(lvlString);

    const data1 = {
        "User_input": prompt,
        "level": level,
        "User_json": {
            "username": metadata.User_json.username,
            "member": metadata.User_json.member,
            "total_score": 0.0,
            "level": {
                'level_1': {
                    "score": 0.0,
                    "start_time": "HH:MM:SS DD:MM:YYYY",
                }
            }
        }
    }
    const data2 = {
        "User_input": prompt,
        "level": level,
        "User_json": {
            "username": metadata.User_json.username,
            "member": metadata.User_json.member,
            "total_score": 0.0,
            "level": {
                'level_2': {
                    "score": 0.0,
                    "start_time": "HH:MM:SS DD:MM:YYYY",
                }
            }
        }
    }
    const data3 = {
        "User_input": prompt,
        "level": level,
        "User_json": {
            "username": metadata.User_json.username,
            "member": metadata.User_json.member,
            "total_score": 0.0,
            "level": {
                'level_3': {
                    "score": 0.0,
                    "start_time": "HH:MM:SS DD:MM:YYYY",
                }
            }
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", `https://pokeprompt.bitgdsc.repl.co/ai-ml-game/${userID}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        console.log(xhr.status);
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            // gptOutput.value = response.res;
            gptOutput.value = ""
            typeWriter(response.res)

            if (response.status == "True" && level <= 3) {
                // gptOutput.value = "Level was completed!";
                // gptOutput.value += "\nLevel was completed!\n"
                // typeWriter("Level was completed!");

                // alert("Level was completed!");
                winPokemon(response.card_url);
                level += 1;
                levelpp();

                if (level != 4) {
                    fetchSystemPrompt(`https://pokeprompt.bitgdsc.repl.co/default/lv_${level}`);
                } else {
                    alert("ALL LEVELS COMPLETED!!!")
                }
            }
            // systemPrompt.textContent = response.sys_prompt;
        } else {
            console.error('Network response was not ok');
        }
    };

    xhr.onerror = function() {
        console.error('Error fetching data:', xhr.statusText);
    };

    if (level == 1) {
        xhr.send(JSON.stringify(data1));

    } else if (level == 2) {
        xhr.send(JSON.stringify(data2));

    } else if (level == 3) {
        xhr.send(JSON.stringify(data3));

    } else {
        alert("DONE!")
    }
}


function fetchLeaderboard() {
    // Create a new XHR object
    var xhr = new XMLHttpRequest();

    // Define the URL endpoint
    var url = "https://pokeprompt.bitgdsc.repl.co/ai-ml-game/leaderboard";

    // Configure the GET request
    xhr.open("GET", url, true);

    // Set up a callback function to handle the response
    xhr.onload = function() {
        if (xhr.status === 200) {
            // If the request was successful (status code 200), log the response
            console.log(xhr.responseText);
            const api_response = JSON.parse(xhr.responseText)

            // Sort the data by 'score' property in descending order
            const sortedData = api_response.res.sort((a, b) => b.score - a.score);

            // Get the table body element
            const tableBody = document.getElementById("table");

            // Clear the existing table rows
            tableBody.innerHTML = '';

            // Iterate through the sorted data and create new table rows
            sortedData.forEach((item, index) => {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
    <td>${index + 1}</td>
    <td>${item.username}</td>
    <td>${item.score}</td>
  `;
                tableBody.appendChild(newRow);
            });
        } else {
            // If there was an error, log an error message
            console.error("Request failed with status:", xhr.status);
        }
    };

    // Send the GET request
    xhr.send();
}

fetchSystemPrompt(`https://pokeprompt.bitgdsc.repl.co/default/lv_${level}`);





confirmSubmitBtn.addEventListener("click", () => {
    submitPrompt(userPrompt.value);
})

pokeball.addEventListener("click", () => {
    document.getElementById('dialog-pikapika').showModal();
})

learderboardBtn.addEventListener("click", () => {
    document.getElementById('dialog-leaderboard').showModal();
    fetchLeaderboard();

})

submitBtn.addEventListener("click", () => {
    // alert("Are u sure to submit?")
    document.getElementById('dialog-submit-prompt').showModal();
    // submitPrompt(userPrompt.value);
})


// shareButton.addEventListener('click', event => {
//     if (navigator.share) {
//         navigator.share({
//                 title: 'GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch "Em All!"',
//                 text: 'GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch "Em All!"\n',
//                 url: 'https://bit-gdsc.github.io/PokePrompt/'
//             }).then(() => {
//                 console.log('Thanks for sharing!');
//             })
//             .catch(console.error);
//     } else {
//         // fallback
//     }
// });

function shareSocials(title, text, url) {
    if (navigator.share) {
        navigator.share({
                title: title,
                text: text,
                url: url
            }).then(() => {
                console.log('Thanks for sharing!');
            })
            .catch(console.error);
    } else {
        // fallback
    }
}


shareButton.addEventListener('click', event => {
    shareSocials("GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch 'Em All!", "GDSC-BIT AI ML Game - PokéPrompt - Gotta Catch 'Em All!", "https://bit-gdsc.github.io/PokePrompt/")
})



sharePokeCardBtn.addEventListener('click', event => {
    shareSocials("Share PokeCard", "Look I wone a Pokémon by playing PokéPrompt by GDSC-BIT\n", pokeCard.src)
});




function winPokemon(cardURL = "https://cdn.discordapp.com/attachments/1152318832602525706/1153040321366728704/pikachu.png") {

    document.getElementById('dialog-win').showModal();
    pokeCard.src = cardURL;
    downloadPokeCard.href = cardURL;

    // window.open(cardURL, '_blank');


}
// winPokemon()
// submitPrompt()