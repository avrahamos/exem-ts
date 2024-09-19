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
const playerNamePG = document.querySelector("#PG p:nth-child(2)");
const pointsPG = document.querySelector("#PG p:nth-child(3)");
const fgPG = document.querySelector("#PG p:nth-child(4)");
const threePointPG = document.querySelector("#PG p:nth-child(5)");
const playerNameSG = document.querySelector("#SG p:nth-child(2)");
const pointsSG = document.querySelector("#SG p:nth-child(3)");
const fgSG = document.querySelector("#SG p:nth-child(4)");
const threePointSG = document.querySelector("#SG p:nth-child(5)");
const playerNameSF = document.querySelector("#SF p:nth-child(2)");
const pointsSF = document.querySelector("#SF p:nth-child(3)");
const fgSF = document.querySelector("#SF p:nth-child(4)");
const threePointSF = document.querySelector("#SF p:nth-child(5)");
const playerNamePF = document.querySelector("#PF p:nth-child(2)");
const pointsPF = document.querySelector("#PF p:nth-child(3)");
const fgPF = document.querySelector("#PF p:nth-child(4)");
const threePointPF = document.querySelector("#PF p:nth-child(5)");
const playerNameC = document.querySelector("#C p:nth-child(2)");
const pointsC = document.querySelector("#C p:nth-child(3)");
const fgC = document.querySelector("#C p:nth-child(4)");
const threePointC = document.querySelector("#C p:nth-child(5)");
let team = {};
function updateRangeValues() {
    pointsValue.textContent = ` ${pointsRange.value} points`;
    fgValue.textContent = ` ${fgRange.value}% FG`;
    threePointValue.textContent = ` ${threePointRange.value}% 3P`;
}
pointsRange.addEventListener("input", updateRangeValues);
fgRange.addEventListener("input", updateRangeValues);
threePointRange.addEventListener("input", updateRangeValues);
const fetchPlayersFromAPI = (searchParams) => __awaiter(void 0, void 0, void 0, function* () {
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
        return response.json();
    }
    catch (error) {
        console.error("Error in fetchPlayersFromAPI:", error);
        return [];
    }
});
const getSearchParams = () => {
    return {
        position: positionSelect.value,
        twoPercent: parseInt(fgRange.value),
        threePercent: parseInt(threePointRange.value),
        points: parseInt(pointsRange.value),
    };
};
const searchPlayers = () => __awaiter(void 0, void 0, void 0, function* () {
    const searchParams = getSearchParams();
    try {
        const players = yield fetchPlayersFromAPI(searchParams);
        displayPlayers(players);
    }
    catch (error) {
        console.error("Error fetching players:", error);
    }
});
const displayPlayers = (players) => {
    clearTable(playersTableBody);
    for (const player of players) {
        try {
            addPlayerToTable(player);
        }
        catch (error) {
            console.error("Error adding player to table:", error);
        }
    }
};
const clearTable = (tableBody) => {
    tableBody.textContent = "";
};
const createTableCell = (text) => {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
};
const addPlayerToTable = (player) => {
    try {
        const row = document.createElement("tr");
        const playerNameTd = createTableCell(player.playerName);
        const positionTd = createTableCell(player.position);
        const pointsTd = createTableCell(player.points.toString());
        const twoPercentTd = createTableCell(`${player.twoPercent}%`);
        const threePercentTd = createTableCell(`${player.threePercent}%`);
        const actionTd = createActionCell(player);
        row.appendChild(playerNameTd);
        row.appendChild(positionTd);
        row.appendChild(pointsTd);
        row.appendChild(twoPercentTd);
        row.appendChild(threePercentTd);
        row.appendChild(actionTd);
        playersTableBody.appendChild(row);
    }
    catch (error) {
        console.error("Error adding player to table:", error);
    }
};
const createActionCell = (player) => {
    const cell = document.createElement("td");
    const addButton = document.createElement("button");
    addButton.textContent = `Add ${getFirstName(player.playerName)} to Current Team`;
    addButton.addEventListener("click", () => addPlayerToTeam(player));
    cell.appendChild(addButton);
    return cell;
};
const addPlayerToTeam = (player) => {
    try {
        const existingPlayer = team[player.position];
        if (existingPlayer) {
            const confirmSwitch = confirm(`You already have a ${player.position}. Do you want to replace ${existingPlayer.playerName} with ${player.playerName}?`);
            if (confirmSwitch) {
                team[player.position] = player;
                updateTeamDisplay();
            }
        }
        else {
            team[player.position] = player;
            updateTeamDisplay();
        }
    }
    catch (error) {
        console.error("Error adding player to team:", error);
    }
};
const updateTeamDisplay = () => {
    try {
        for (const card of playerCards) {
            const position = card.id;
            const playerInfo = team[position];
            if (playerInfo) {
                updatePlayerCard(card, playerInfo);
            }
        }
    }
    catch (error) {
        console.error("Error updating team display:", error);
    }
};
const updatePlayerCard = (card, playerInfo) => {
    try {
        switch (card.id) {
            case "PG":
                playerNamePG.textContent = `Name: ${playerInfo.playerName}`;
                pointsPG.textContent = `Points: ${playerInfo.points}`;
                fgPG.textContent = `FG%: ${playerInfo.twoPercent}%`;
                threePointPG.textContent = `3P%: ${playerInfo.threePercent}%`;
                break;
            case "SG":
                playerNameSG.textContent = `Name: ${playerInfo.playerName}`;
                pointsSG.textContent = `Points: ${playerInfo.points}`;
                fgSG.textContent = `FG%: ${playerInfo.twoPercent}%`;
                threePointSG.textContent = `3P%: ${playerInfo.threePercent}%`;
                break;
            case "SF":
                playerNameSF.textContent = `Name: ${playerInfo.playerName}`;
                pointsSF.textContent = `Points: ${playerInfo.points}`;
                fgSF.textContent = `FG%: ${playerInfo.twoPercent}%`;
                threePointSF.textContent = `3P%: ${playerInfo.threePercent}%`;
                break;
            case "PF":
                playerNamePF.textContent = `Name: ${playerInfo.playerName}`;
                pointsPF.textContent = `Points: ${playerInfo.points}`;
                fgPF.textContent = `FG%: ${playerInfo.twoPercent}%`;
                threePointPF.textContent = `3P%: ${playerInfo.threePercent}%`;
                break;
            case "C":
                playerNameC.textContent = `Name: ${playerInfo.playerName}`;
                pointsC.textContent = `Points: ${playerInfo.points}`;
                fgC.textContent = `FG%: ${playerInfo.twoPercent}%`;
                threePointC.textContent = `3P%: ${playerInfo.threePercent}%`;
                break;
            default:
                console.error(`Unknown position: ${card.id}`);
        }
    }
    catch (error) {
        console.error("Error updating player card:", error);
    }
};
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchPlayers();
});
const getFirstName = (fullName) => {
    return fullName.split(" ")[0];
};
