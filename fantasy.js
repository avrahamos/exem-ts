"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseUrl = "https://nbaserver-q21u.onrender.com/api/filter";
const positionSelect = document.querySelector("#position");
const pointsRange = document.querySelector("#pointsRange");
const fgRange = document.querySelector("#fgRange");
const threePointRange = document.querySelector("#threePointRange");
const searchBtn = document.querySelector(".searchBtn");
const playersTableBody = document.querySelector("#playersTable tbody");
const playerCards = document.querySelectorAll(".playerCard");
const pointsValue = document.createElement("span");
const fgValue = document.createElement("span");
const threePointValue = document.createElement("span");
pointsRange.after(pointsValue);
fgRange.after(fgValue);
threePointRange.after(threePointValue);
function updateRangeValues() {
    pointsValue.textContent = ` ${pointsRange.value} points`;
    fgValue.textContent = ` ${fgRange.value}% FG`;
    threePointValue.textContent = ` ${threePointRange.value}% 3P`;
}
pointsRange.addEventListener("input", updateRangeValues);
fgRange.addEventListener("input", updateRangeValues);
threePointRange.addEventListener("input", updateRangeValues);
const searchPlayer = () => __awaiter(void 0, void 0, void 0, function* () {
    const position = positionSelect.value;
    const points = pointsRange.value;
    const twoPercent = fgRange.value;
    const threePercent = threePointRange.value;
    const searchParams = {
        position: position,
        twoPercent: parseInt(twoPercent),
        threePercent: parseInt(threePercent),
        points: parseInt(points),
    };
    try {
        const response = yield fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(searchParams),
        });
        if (!response.ok) {
            throw new Error("Failed to fetch players.");
        }
        const players = yield response.json();
        displayPlayers(players);
    }
    catch (error) {
        console.log(error);
    }
});
const displayPlayers = (players) => {
    playersTableBody.textContent = "";
    for (const player of players) {
        const row = document.createElement("tr");
        const playerNameTd = document.createElement("td");
        playerNameTd.textContent = player.playerName;
        const positionTd = document.createElement("td");
        positionTd.textContent = player.position;
        const pointsTd = document.createElement("td");
        pointsTd.textContent = player.points.toString();
        const twoPercentTd = document.createElement("td");
        twoPercentTd.textContent = `${player.twoPercent}%`;
        const threePercentTd = document.createElement("td");
        threePercentTd.textContent = `${player.threePercent}%`;
        const actionTd = document.createElement("td");
        const addButton = document.createElement("button");
        addButton.textContent = `Add ${player.playerName} to Current Team`;
        addButton.onclick = () => addPlayerToTeam(player.playerName, player.position, player.points, player.twoPercent, player.threePercent);
        actionTd.appendChild(addButton);
        row.appendChild(playerNameTd);
        row.appendChild(positionTd);
        row.appendChild(pointsTd);
        row.appendChild(twoPercentTd);
        row.appendChild(threePercentTd);
        row.appendChild(actionTd);
        playersTableBody.appendChild(row);
    }
};
const addPlayerToTeam = (playerName, position, points, twoPercent, threePercent) => {
    const team = JSON.parse(localStorage.getItem("fantasyTeam") || "[]");
    if (team[position]) {
        const confirmSwitch = confirm(`You already have a ${position}. Do you want to replace ${team[position].playerName} with ${playerName}?`);
        if (!confirmSwitch) {
            return;
        }
    }
    team[position] = { playerName, points, twoPercent, threePercent };
    localStorage.setItem("fantasyTeam", JSON.stringify(team));
    updateTeamDisplay();
};
const updateTeamDisplay = () => {
    const team = JSON.parse(localStorage.getItem("fantasyTeam") || "[]");
    for (const card of playerCards) {
        const position = card.id;
        const playerInfo = team[position];
        if (playerInfo) {
            card.querySelector("p:nth-child(2)").textContent = playerInfo.playerName;
            card.querySelector("p:nth-child(3)").textContent = `Points: ${playerInfo.points}`;
            card.querySelector("p:nth-child(4)").textContent = `Two Percent: ${playerInfo.twoPercent}%`;
            card.querySelector("p:nth-child(5)").textContent = `Three Percent: ${playerInfo.threePercent}%`;
        }
        else {
            card.querySelector("p:nth-child(2)").textContent = "";
            card.querySelector("p:nth-child(3)").textContent = "";
            card.querySelector("p:nth-child(4)").textContent = "";
            card.querySelector("p:nth-child(5)").textContent = "";
        }
    }
};
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchPlayer();
});
