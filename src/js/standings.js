
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

var teamStats = {};

function teamStatsObjInit() {
    window.teamStats = {}
    for (const groupId in groups) {
        if (groups.hasOwnProperty(groupId)) {
            const group = groups[groupId];

            group.teams.forEach(team => {
                teamStats[team] = {
                    groupId: groupId,
                    matchesPlayed: 0,
                    matchesWon: 0,
                    matchesLost: 0,
                    totalPoints: 0,
                    pointDiff: 0
                };
            });
        }
    }
}

teamStatsObjInit();


function updateOverallStats(winningTeam, losingTeam, winningTeamScore, losingTeamScore, totalPoints) {
    teamStats[winningTeam].matchesPlayed += 1;
    teamStats[winningTeam].matchesWon += 1;
    teamStats[winningTeam].totalPoints += totalPoints;
    teamStats[winningTeam].pointDiff += winningTeamScore - losingTeamScore;

    teamStats[losingTeam].matchesPlayed += 1;
    teamStats[losingTeam].matchesLost += 1;
    teamStats[losingTeam].pointDiff = losingTeamScore - winningTeamScore;
}

function getStandingsTableData(matchData) {
    teamStatsObjInit();
    for (const matchId in matchData) {
        if (matchData.hasOwnProperty(matchId)) {
            const match = matchData[matchId];

            let teamAWins = 0;
            let teamBWins = 0;
            let teamAScoreSum = 0;
            let teamBScoreSum = 0;
            let teamA = "";
            let teamB = "";
            let subMatchCount = 0;

            for (const subMatchId in match) {
                if (match.hasOwnProperty(subMatchId)) {
                    const subMatch = match[subMatchId];

                    if (subMatch.matchStatus === "over" && subMatch.isGroupMatch !== "NA") {
                        teamA = subMatch.teamA;
                        teamB = subMatch.teamB;

                        if (subMatch.teamAScore > subMatch.teamBScore) {
                            if (subMatch.isTMatch === "teamA") {
                                teamAScoreSum++;
                            } else if (subMatch.isTMatch === "teamB") {
                                teamBScoreSum--;
                            }
                            teamAScoreSum++;
                        } else {
                            if (subMatch.isTMatch === "teamB") {
                                teamBScoreSum++;
                            } else if (subMatch.isTMatch === "teamA") {
                                teamAScoreSum--;
                            }

                            teamBScoreSum++;
                        }
                        if (subMatch.teamAScore > subMatch.teamBScore) {
                            teamAWins++;
                        } else if (subMatch.teamAScore < subMatch.teamBScore) {
                            teamBWins++;
                        }

                    }
                }
                subMatchCount++;
            }

            if (teamAWins > teamBWins) {
                updateOverallStats(teamA, teamB, teamAScoreSum, teamBScoreSum, (teamAWins - teamBWins == subMatchCount) ? 4 : 3);
            } else if (teamBWins > teamAWins) {
                updateOverallStats(teamB, teamA, teamBScoreSum, teamAScoreSum, (teamAWins - teamBWins == subMatchCount) ? 4 : 3);
            }
        }
    }

    generateTablesHTML()
}
function generateTablesHTML() {
    let html = '';

    // Check if the groups object exists
    if (!groups || typeof groups !== 'object') {
        console.error('Groups data is not available or invalid.');
        return;
    }

    // Iterate over each group in the groups object
    for (const groupId in groups) {
        if (groups.hasOwnProperty(groupId)) {
            const group = groups[groupId];
            const teamStatsArray = [];

            // Check if the group has teams and teamStats exist
            if (group.teams && Array.isArray(group.teams) && group.teams.length > 0) {
                group.teams.forEach(team => {
                    if (teamStats[team]) {
                        teamStatsArray.push({
                            team: team,
                            stats: teamStats[team]
                        });
                    } else {
                        console.warn(`Stats for team ${team} not found.`);
                    }
                });
            } else {
                console.warn(`No teams found for group ${group.name}.`);
            }

            // Sort teams in descending order of totalPoints
            teamStatsArray.sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);

            // Generate HTML for the current group table
            html += '<table>';
            html += `<tr><td colspan="6">${group.name}</td></tr>`;
            html += '<tr><th>Team</th><th>MP</th><th>W</th><th>L</th><th>Pts</th><th>PD</th></tr>';

            // Add rows for each team's stats
            teamStatsArray.forEach(item => {
                html += `<tr><td>${item.team}</td><td>${item.stats.matchesPlayed}</td><td>${item.stats.matchesWon}</td><td>${item.stats.matchesLost}</td><td>${item.stats.totalPoints}</td><td>${item.stats.pointDiff}</td></tr>`;
            });

            html += '</table>';
        }
    }

    // Update the DOM with the generated HTML
    const standingsContainer = document.getElementById("standingsContainer");
    if (standingsContainer) {
        standingsContainer.innerHTML = html;
    } else {
        console.error('Element with id "standingsContainer" not found.');
    }
}
