const systemPrompt = document.querySelector("#prompt");
const gptOutput = document.querySelector("#response");
const userPrompt = document.querySelector("#prompt-input");

const submitBtn = document.querySelector("#submit-btn");


let level = JSON.parse(localStorage.getItem("metadata")).level;


function levelpp() {
    const metadata = JSON.parse(localStorage.getItem("metadata"));
    metadata.level += 1;
    localStorage.setItem("metadata", JSON.stringify(metadata));
}

function fetchSystemPrompt(url) {
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
            "username": metadata.username,
            "member": metadata.member,
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
            "username": metadata.username,
            "member": metadata.member,
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
            "username": metadata.username,
            "member": metadata.member,
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
            gptOutput.value = response.res;
            if (response.status == "True" && level <= 3) {
                gptOutput.value = "Level was completed!";
                alert(level)
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


fetchSystemPrompt(`https://pokeprompt.bitgdsc.repl.co/default/lv_${level}`);


submitBtn.addEventListener("click", () => {
        submitPrompt(userPrompt.value);
    })
    // submitPrompt()