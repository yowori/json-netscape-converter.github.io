const nicknameElement = document.getElementById('title');
const subtitleElement = document.getElementById('inputLabel');
const madeby = document.getElementById('madeby');
const titleElement = document.getElementById('outputLabel');
const buttonElements = document.querySelectorAll('button');


function scrambleText(element, text, duration = 3000) {
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);

        const scrambled = text.split('').map((char, i) => {
            if (i <= Math.floor(progress * text.length)) return char;
            return String.fromCharCode(33 + Math.random() * (126 - 33));
        }).join('');

        element.textContent = scrambled;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = text;
        }
    }

    requestAnimationFrame(animate);
}


function startScramble() {
    scrambleText(nicknameElement, nicknameElement.textContent);
    scrambleText(subtitleElement, subtitleElement.textContent);
		scrambleText(madeby, madeby.textContent);
    scrambleText(titleElement, titleElement.textContent);

    buttonElements.forEach(button => {
        scrambleText(button, button.textContent);
    });
}


window.onload = () => {
    startScramble();
};

let isJsonToNetscape = true;
document.getElementById("swapButton").addEventListener("click", () => {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const inputLabel = document.getElementById("inputLabel");
    const outputLabel = document.getElementById("outputLabel");

		inputText.value = '';
    outputText.value = '';


    [inputText.value, outputText.value] = [outputText.value, inputText.value];
    [inputLabel.textContent, outputLabel.textContent] = [outputLabel.textContent, inputLabel.textContent];


    document.getElementById("convertButton").textContent = isJsonToNetscape ? "Convert to JSON" : "Convert to Netscape";
    isJsonToNetscape = !isJsonToNetscape;
});


function convertJsonToNetscape(jsonText) {
    try {
        const cookies = JSON.parse(jsonText);
        let netscapeOutput = "# Netscape HTTP Cookie File\n";

        cookies.forEach(cookie => {
            const domain = cookie.domain.startsWith(".") ? cookie.domain : "." + cookie.domain;
            const flag = cookie.httpOnly ? "TRUE" : "FALSE";
            const path = cookie.path || "/";
            const secure = cookie.secure ? "TRUE" : "FALSE";
            const expiration = cookie.expirationDate || "0";
            netscapeOutput += `${domain}\t${flag}\t${path}\t${secure}\t${expiration}\t${cookie.name}\t${cookie.value}\n`;
        });

        return netscapeOutput;
    } catch (error) {
        return "Invalid JSON format";
    }
}


function convertNetscapeToJson(netscapeText) {
    const lines = netscapeText.split("\n").filter(line => line && !line.startsWith("#"));
    const cookies = [];

    lines.forEach(line => {
        const [domain, flag, path, secure, expiration, name, value] = line.split("\t");
        cookies.push({
            domain: domain.startsWith(".") ? domain.slice(1) : domain,
            httpOnly: flag === "TRUE",
            path: path || "/",
            secure: secure === "TRUE",
            expirationDate: parseInt(expiration, 10),
            name,
            value
        });
    });

    return JSON.stringify(cookies, null, 4);
}


document.getElementById("convertButton").addEventListener("click", () => {
    const inputText = document.getElementById("inputText").value;
    const outputText = document.getElementById("outputText");

    if (isJsonToNetscape) {
        outputText.value = convertJsonToNetscape(inputText);
    } else {
        outputText.value = convertNetscapeToJson(inputText);
    }
});
