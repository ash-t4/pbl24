window.homeCount = 0;
window.guestCount = 0;
window.homeTeamName = "";
window.guestTeamName = "";
window.homeTeamPlayers = "";
window.guestTeamPlayers = "";
window.matchStatus = "";
window.isTMatch = "no";
window.isGroupMatch = "NA";
window.subMatchType;
window.scoreHomeEl = document.getElementById("scoreHome");
window.scoreGuestEl = document.getElementById("scoreGuest");
window.titleInput = document.getElementById("titleInput");
window.matchTypeInput = document.getElementById("matchType");
window.isTmatchInput = document.getElementById("isTrump");
window.isGroupMatchInput = document.getElementById("isGroup");
window.matchKey = "";
window.subMatchKey = "";
window.createNewMatch = false;
const domain = window.location.host + "" + window.location.pathname;

document.getElementById("homeInput").value = homeTeamName;
document.getElementById("guestInput").value = guestTeamName;

scoreHomeEl.textContent = homeCount;
scoreGuestEl.textContent = guestCount;
isTmatchInput.value = isTMatch;
isGroupMatchInput.value = isGroupMatch;

const groups = {
    "GROUP-A": {
        name: "Group A",
        teams: ["Bandipur Blazers", "Nallamala Nets", "Saranda Shuttlers"],
    },
    "GROUP-B": {
        name: "Group B",
        teams: ["Gir Gliders", "Kaziranga Kaisers", "Nilgiri Ninjas"],
    },
    "GROUP-C": {
        name: "Group C",
        teams: ["Corbett Crushers", "Kanha Knights", "Wayanad Warriors"],
    },
    "GROUP-D": {
        name: "Group D",
        teams: ["Sundarbans Smashers", "Namdapha Nimblebirds", "Pichavaram Phoenixes"],
    }
};

const allTeams = [
    "Bandipur Blazers", "Nallamala Nets", "Saranda Shuttlers",
    "Gir Gliders", "Kaziranga Kaisers", "Pichavaram Phoenixes",
    "Corbett Crushers", "Kanha Knights", "Wayanda Warriors",
    "Sundarbans Smashers", "Namdapha Nimblebirds", "Nilgiri Ninjas"
];

function populateSelect() {
    const selectElementA = document.getElementById('homeInput');
    const selectElementB = document.getElementById('guestInput');
    const groupElement = document.getElementById('isGroup');

    selectElementA.innerHTML = '';
    selectElementB.innerHTML = '';

    const selectedGroup = groupElement.value;
    let teamNames;

    if (selectedGroup === "NA") {
        teamNames = allTeams;
    } else {
        teamNames = groups[selectedGroup].teams;
    }

    teamNames.forEach(teamName => {
        const optionA = document.createElement('option');
        const optionB = document.createElement('option');

        optionA.value = teamName;
        optionA.textContent = teamName;

        optionB.value = teamName;
        optionB.textContent = teamName;

        if (window.homeTeamName === teamName) {
            optionA.setAttribute("selected", "");
        } else if (window.guestTeamName === teamName) {
            optionB.setAttribute("selected", "");
        }

        selectElementA.appendChild(optionA);
        selectElementB.appendChild(optionB);
    });
}

document.getElementById('isGroup').addEventListener('change', populateSelect);
populateSelect();


function updateScore(team, score) {
    if (team === "home") {
        homeCount += score;
        if (homeCount < 0) {
            homeCount -= score; // Revert back to the original score
            alert("Score cannot be negative!");
        } else {
            scoreHomeEl.textContent = homeCount;
        }
    } else {
        guestCount += score;
        if (guestCount < 0) {
            guestCount -= score; // Revert back to the original score
            alert("Score cannot be negative!");
        } else {
            scoreGuestEl.textContent = guestCount;
        }
    }
}


function enableEdit(inputId, buttonId) {
    var inputField = document.getElementById(inputId);
    var editButton = document.getElementById(buttonId);

    if (inputField.hasAttribute("readonly")) {
        inputField.removeAttribute("readonly");
        editButton.textContent = "✔";
    } else {
        inputField.setAttribute("readonly", "");
        editButton.textContent = "✎";
    }
}


function showToast(message) {
    alert(message);
}

function toggleLiveStatus() {
    if (matchStatus === "scheduled") {
        matchStatus = "live";
    } else if (matchStatus === "live") {
        matchStatus = "over";
    } else {
        alert("This match is already over");
    }

    let liveButtonCont = document.getElementById("liveButtonContent");
    let liveButtonIdic = document.getElementById("liveButtonIndicator");

    liveButtonCont.textContent = matchStatus === "live" ? "End Match" : "Go Live!";

    if (matchStatus === "live") {
        liveButtonIdic.classList.add("pulse");
    } else {
        liveButtonIdic.classList.remove("pulse");
    }
}

document.getElementById("liveButton").addEventListener('click', toggleLiveStatus);

function generateId(titleInputValue) {
    let id = titleInputValue.toLowerCase();
    id = id.replace(/\s+/g, '');
    return id;
}


function showInvalidURL() {
    // Hide other divs
    document.getElementById("authenticate").classList.add("displayNone");
    document.getElementById("matches").classList.add("displayNone");
    document.getElementById("matchView").classList.add("displayNone");
    hideLoading();
    // Show the invalidURL div
    const invalidURLDiv = document.getElementById("invalidURL");
    invalidURLDiv.innerText = "An error occurred. Please contact admin.";
    invalidURLDiv.classList.remove("displayNone");
}


function showAdminPage() {
    document.getElementById("authenticate").classList.add("displayNone");
    document.getElementById("invalidURL").classList.add("displayNone");

    document.getElementById("matches").classList.remove("displayNone");
    document.getElementById("titleEditButton").classList.remove("displayNone");

    document.getElementById("homeInput").removeAttribute("disabled");
    document.getElementById("guestInput").removeAttribute("disabled");

    document.getElementById("isTrump").removeAttribute("disabled");

    document.getElementById("homePlayersEditButton").classList.remove("displayNone");
    document.getElementById("guestPlayersEditButton").classList.remove("displayNone");

    document.getElementById("qrcode").classList.remove("displayNone");

    var script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    document.head.appendChild(script);

    script.onload = function() {
        updateQR();
    };

    let icon = document.querySelector('#qrcode > .icon');
    let container = document.querySelector('#qrcode > .container');

    icon.addEventListener('mouseenter', function() {
        updateQR();
        container.classList.remove('displayNone');
    });

    icon.addEventListener('mouseleave', function() {
        container.classList.add('displayNone');
    });
}

function updateQR() {
    var qrContainer = document.querySelector('#qrcode > .container');
    qrContainer.innerHTML = "";
    var qrCode = new QRCode(qrContainer, {
        text: domain + "?view=score-board&match=" + window.matchKey + "&sub-match=" + window.subMatchKey,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L
    });
}

function renderMatchListForAdmin(matches) {
    const container = document.getElementById('matchesContainer');
    const matchRows = container.getElementsByClassName("matchRow");
    Array.from(matchRows).forEach(matchRow => matchRow.remove());

    for (const mainMatchName in matches) {
        if (matches.hasOwnProperty(mainMatchName)) {
            const mainMatch = matches[mainMatchName];
            const mainMatchRow = document.createElement('div');
            mainMatchRow.classList.add('matchRow');

            const mainMatchTitle = document.createElement('span');
            mainMatchTitle.classList.add('mainMatchTitle');
            mainMatchTitle.innerText = mainMatch[Object.keys(mainMatch)[0]].title;

            // Create a container for submatches
            const submatchesContainer = document.createElement('div');
            submatchesContainer.classList.add('submatchesContainer');
            submatchesContainer.style.maxHeight = '0'; // Initially hide submatches
            submatchesContainer.style.overflow = 'hidden'; // Hide overflow

            mainMatchTitle.addEventListener('click', function() {
                // Toggle the display of submatches
                if (submatchesContainer.style.maxHeight === '0px') {
                    // Show submatches
                    submatchesContainer.style.maxHeight = submatchesContainer.scrollHeight + 'px';
                } else {
                    // Hide submatches
                    submatchesContainer.style.maxHeight = '0';
                }
            });

            mainMatchRow.appendChild(mainMatchTitle);
            mainMatchRow.appendChild(submatchesContainer);
            container.appendChild(mainMatchRow);

            // Iterate over submatches and create submatch rows
            for (const submatchType in mainMatch) {
                if (mainMatch.hasOwnProperty(submatchType) && submatchType !== 'title') {
                    const submatch = mainMatch[submatchType];
                    const submatchRow = document.createElement('div');
                    submatchRow.classList.add('submatchRow');
                    submatchRow.innerHTML = `
                        <span>${submatchType}</span>
                    `;
                    submatchRow.setAttribute("onclick", `showSelectedMatchDetails('${mainMatchName}', '${submatchType}')`)
                    submatchesContainer.appendChild(submatchRow);
                }
            }
        }
    }
}


function showMatches() {
    matchesDiv = document.getElementById("matches");
    if (!matchesDiv.hasAttribute("open")) {
        matchesDiv.style.left = "0px";
        matchesDiv.setAttribute("open", "");
    } else {
        matchesDiv.style.left = "-342px";
        matchesDiv.removeAttribute("open");
    }
}

function showNewMatchForm() {
    window.createNewMatch = true;
    // Reset match title input
    document.getElementById('titleInput').value = '';

    // Reset match type select and disable it
    const matchTypeSelect = document.getElementById('matchType');
    matchTypeSelect.selectedIndex = 0; // Set the first option as selected
    matchTypeSelect.disabled = true;

    document.getElementById("isGroup").removeAttribute("disabled");
    // Reset Trump match select
    document.getElementById('isTrump').selectedIndex = 0; // Set the first option as selected

    // Reset home team input and score display
    document.getElementById('homeInput').value = '';
    document.getElementById('scoreHome').innerText = '0';

    // Reset guest team input and score display
    document.getElementById('guestInput').value = '';
    document.getElementById('scoreGuest').innerText = '0';

    window.homeCount = 0;
    window.guestCount = 0;
    window.matchStatus = "";
}