function toggleSubMatches(expandButton) {
    const subMatchesElement = expandButton.parentElement.querySelector(".subMatches");
    const height = subMatchesElement.childElementCount * 155;
    const elemHeight = subMatchesElement.style.height;

    // Find the parent with class "fixture"
    const fixtureElement = expandButton.closest('.fixture');

    if (elemHeight === '0px' || elemHeight === "") {
        subMatchesElement.style.height = height + 'px';
        expandButton.classList.add('collapsed');
    } else {
        subMatchesElement.style.height = '0px';
        expandButton.classList.remove('collapsed');
    }

    // Smoothly scroll the parent "fixture" element to the top
    if (fixtureElement) {
        smoothScrollTo(fixtureElement);
    }
}

function smoothScrollTo(element) {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = elementTop - startPosition;
    const duration = 600; // Duration of the scroll in milliseconds
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}


function createFixtures(matchesData, onlyLive) {
    var hasNoLive = true;
    Object.keys(matchesData).forEach(matchId => {
        let isLiveMatch = false;
        const match = matchesData[matchId];

        if (onlyLive) {
            for (let subMatch of Object.keys(match)) {
                if (match[subMatch]["isGroupMatch"] === "no" || match[subMatch]["matchStatus"] === "live") {
                    isLiveMatch = true;
                    hasNoLive = false;
                    break;
                }
            }
        }

        if (onlyLive && !isLiveMatch && document.getElementById(matchId)) {
            document.getElementById(matchId).remove();
        }

        if (onlyLive && isLiveMatch || !onlyLive) {
            document.getElementById("noFixturesContainer") ? document.getElementById("noFixturesContainer").innerHTML = "" : "";
            const existingFixture = document.getElementById(matchId);
            if (existingFixture) {
                updateMatchFixture(existingFixture, match);
            } else {
                const matchFixtureHTML = createMatchFixture(matchId, match);
                document.getElementById("fixturesContainerMain").innerHTML += matchFixtureHTML;
            }
        }
    });

    if (hasNoLive && document.getElementById("noFixturesContainer")) {
        document.getElementById("noFixturesContainer").innerHTML = `<p class="fs-2 fs-lg-1 lh-sm mb-1" >We are updating the scores. Look into the fixtures and stay tuned.</p>`;
    }
}

function updateMatchFixture(existingFixture, matchData) {
    let matchScoreTeamA = 0;
    let matchScoreTeamB = 0;
    let matchesOverCount = 0;
    let allMatchWonByA = true;
    let allMatchWonByB = true;

    const subMatchesElement = existingFixture.querySelector('.subMatches');
    subMatchesElement.innerHTML = '';

    for (let subMatch of Object.keys(matchData)) {
        const subMatchData = matchData[subMatch];
        subMatchesElement.innerHTML += createSubMatch(subMatchData);

        if (subMatchData.matchStatus === "over") {
            matchesOverCount++;
            if (subMatchData.teamAScore > subMatchData.teamBScore) {
                if (subMatchData.isTMatch === "teamA") {
                    matchScoreTeamA++;
                } else if (subMatchData.isTMatch === "teamB") {
                    matchScoreTeamB--;
                }
                matchScoreTeamA++;
                allMatchWonByB = false;
            } else {
                if (subMatchData.isTMatch === "teamA") {
                    matchScoreTeamA--;
                } else if (subMatchData.isTMatch === "teamB") {
                    matchScoreTeamB++;
                }
                matchScoreTeamB++;
                allMatchWonByA = false;
            }
        }
    }

    // if (matchesOverCount == Object.keys(matchData).length) {
    //     if (allMatchWonByA) {
    //         matchScoreTeamA++;
    //     }
    //     if (allMatchWonByB) {
    //         matchScoreTeamB++;
    //     }
    // }

    existingFixture.querySelector('.teamAScore').innerText = matchScoreTeamA;
    existingFixture.querySelector('.teamBScore').innerText = matchScoreTeamB;
    existingFixture.querySelector('.teamAScore').setAttribute('win', matchScoreTeamA > matchScoreTeamB);
    existingFixture.querySelector('.teamBScore').setAttribute('win', matchScoreTeamA < matchScoreTeamB);
}

function createMatchFixture(matchId, matchData) {
    let allSubMatchesHTML = "";
    let matchScoreTeamA = 0;
    let matchScoreTeamB = 0;
    let matchesOverCount = 0;
    let allMatchWonByA = true;
    let allMatchWonByB = true;

    for (let subMatch of Object.keys(matchData)) {
        const subMatchData = matchData[subMatch];
        allSubMatchesHTML += createSubMatch(subMatchData);

        if (subMatchData.matchStatus === "over") {
            matchesOverCount++;
            if (subMatchData.teamAScore > subMatchData.teamBScore) {
                if (subMatchData.isTMatch.includes("teamA")) {
                    matchScoreTeamA++;
                }
                
                if (subMatchData.isTMatch.includes("teamB")) {
                    matchScoreTeamB--;
                }

                matchScoreTeamA++;
                allMatchWonByB = false;
            } else if (subMatchData.teamAScore < subMatchData.teamBScore) {
                if (subMatchData.isTMatch.includes("teamA")) {
                    matchScoreTeamA--;
                }
                
                if (subMatchData.isTMatch.includes("teamB")) {
                    matchScoreTeamB++;
                }

                matchScoreTeamB++;
                allMatchWonByA = false;
            }
        }
    }

    const commonData = matchData[Object.keys(matchData)[0]];

    return `<div id="${matchId}" class="fixture">
        <div class="title">${commonData.title}</div>
        <div class="matchDetails">
            <div class="teamsAndScore">
                <div class="teamA">
                    <div class="teamName">${commonData.teamA}</div>
                    <div class="teamLogo"></div>
                </div>
                <div class="score">
                    <span class="teamAScore" win="${matchScoreTeamA > matchScoreTeamB}">
                        ${matchScoreTeamA}
                    </span>
                    <span class="sep">-</span>
                    <span class="teamBScore" win="${matchScoreTeamA < matchScoreTeamB}">
                        ${matchScoreTeamB}
                    </span>
                </div>
                <div class="teamB">
                    <div class="teamName">${commonData.teamB}</div>
                    <div class="teamLogo"></div>
                </div>
            </div>
        </div>
        <div class="subMatches">${allSubMatchesHTML}</div>
        <div class="expandSubMatches" onclick="toggleSubMatches(this)">&#8964;</div>
    </div>`;
}

function createSubMatch(subMatchData) {
    return `<div class="subMatch">
        <div class="matchType">${subMatchData.subMatchType}</div>
        <div class="teamsAndScore">
            <div class="teamA">
                <div class="teamPlayers">
                    ${subMatchData.teamAPlayers.split(',')
            .map(name => name.trim())
            .join('<br>')}
                </div>
                <span class="trumpIcon" isTrump="${subMatchData.isTMatch.includes('teamA') && (subMatchData.matchStatus === "live"  || subMatchData.matchStatus === "over")}"></span>
            </div>
            <div class="score">
                <span class="teamAScore" win="${subMatchData.teamAScore > subMatchData.teamBScore && subMatchData.matchStatus === "over"}">
                    ${subMatchData.teamAScore}
                </span>
                <span class="sep">-</span>
                <span class="teamBScore" win="${subMatchData.teamAScore < subMatchData.teamBScore && subMatchData.matchStatus === "over"}">
                    ${subMatchData.teamBScore}
                </span>
            </div>
            <div class="teamB">
                <div class="teamPlayers">
                    ${subMatchData.teamBPlayers.split(',')
            .map(name => name.trim())
            .join('<br>')}
                </div>
                <span class="trumpIcon" isTrump="${subMatchData.isTMatch.includes('teamB')  && (subMatchData.matchStatus === "live" || subMatchData.matchStatus === "over")}"></span>
            </div>
        </div>
        <span class="matchStatus">${subMatchData.matchStatus}</span>
    </div>`;
}
