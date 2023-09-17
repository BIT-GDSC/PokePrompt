const systemPrompt = document.querySelector("#prompt");


function fetchSystemPrompt(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            systemPrompt.textContent = data.sys_prompt;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


fetchSystemPrompt("https://pokeprompt.bitgdsc.repl.co/default/lv_3");