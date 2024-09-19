const baseUrl: string = "https://nbaserver-q21u.onrender.com/api/filter";
const positionSelect: HTMLOptionElement = document.querySelector("#position")!;
const pointsRange: HTMLInputElement = document.querySelector("#pointsRange")!;
const fgRange: HTMLInputElement = document.querySelector("#fgRange")!;
const threePointRange: HTMLInputElement =
  document.querySelector("#threePointRange")!;
const searchBtn: HTMLButtonElement = document.querySelector(".searchBtn")!;
const playersTableBody: HTMLTableSectionElement = document.querySelector(
  "#playersTable tbody"
)!;
const playerCards: NodeListOf<HTMLDivElement> =
  document.querySelectorAll(".playerCard")!;
const pointsValue = document.createElement("span");
const fgValue = document.createElement("span");
const threePointValue = document.createElement("span");
pointsRange.after(pointsValue);
fgRange.after(fgValue);
threePointRange.after(threePointValue);

const playerNamePG = document.querySelector("#PG p:nth-child(2)")!;
const pointsPG = document.querySelector("#PG p:nth-child(3)")!;
const fgPG = document.querySelector("#PG p:nth-child(4)")!;
const threePointPG = document.querySelector("#PG p:nth-child(5)")!;

const playerNameSG = document.querySelector("#SG p:nth-child(2)")!;
const pointsSG = document.querySelector("#SG p:nth-child(3)")!;
const fgSG = document.querySelector("#SG p:nth-child(4)")!;
const threePointSG = document.querySelector("#SG p:nth-child(5)")!;

const playerNameSF = document.querySelector("#SF p:nth-child(2)")!;
const pointsSF = document.querySelector("#SF p:nth-child(3)")!;
const fgSF = document.querySelector("#SF p:nth-child(4)")!;
const threePointSF = document.querySelector("#SF p:nth-child(5)")!;

const playerNamePF = document.querySelector("#PF p:nth-child(2)")!;
const pointsPF = document.querySelector("#PF p:nth-child(3)")!;
const fgPF = document.querySelector("#PF p:nth-child(4)")!;
const threePointPF = document.querySelector("#PF p:nth-child(5)")!;

const playerNameC = document.querySelector("#C p:nth-child(2)")!;
const pointsC = document.querySelector("#C p:nth-child(3)")!;
const fgC = document.querySelector("#C p:nth-child(4)")!;
const threePointC = document.querySelector("#C p:nth-child(5)")!;

let team: { [key: string]: PlayerBack | undefined } = {};

function updateRangeValues() {
  pointsValue.textContent = ` ${pointsRange.value} points`;
  fgValue.textContent = ` ${fgRange.value}% FG`;
  threePointValue.textContent = ` ${threePointRange.value}% 3P`;
}

interface PlayerSearch {
  position: string;
  twoPercent: number;
  threePercent: number;
  points: number;
}

interface PlayerBack {
  position: string;
  twoPercent: number;
  threePercent: number;
  points: number;
  playerName: string;
}

pointsRange.addEventListener("input", updateRangeValues);
fgRange.addEventListener("input", updateRangeValues);
threePointRange.addEventListener("input", updateRangeValues);

const fetchPlayersFromAPI = async (
  searchParams: PlayerSearch
): Promise<PlayerBack[]> => {
  try {
    const response: Response = await fetch(baseUrl, {
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
  } catch (error) {
    console.error("Error in fetchPlayersFromAPI:", error);
    return [];
  }
};

const getSearchParams = (): PlayerSearch => {
  return {
    position: positionSelect.value,
    twoPercent: parseInt(fgRange.value),
    threePercent: parseInt(threePointRange.value),
    points: parseInt(pointsRange.value),
  };
};

const searchPlayers = async (): Promise<void> => {
  const searchParams: PlayerSearch = getSearchParams();
  try {
    const players: PlayerBack[] = await fetchPlayersFromAPI(searchParams);
    displayPlayers(players);
  } catch (error) {
    console.error("Error fetching players:", error);
  }
};

const displayPlayers = (players: PlayerBack[]): void => {
  clearTable(playersTableBody);
  for (const player of players) {
    try {
      addPlayerToTable(player);
    } catch (error) {
      console.error("Error adding player to table:", error);
    }
  }
};

const clearTable = (tableBody: HTMLTableSectionElement): void => {
  tableBody.textContent = "";
};

const createTableCell = (text: string): HTMLTableCellElement => {
  const cell: HTMLTableCellElement = document.createElement("td");
  cell.textContent = text;
  return cell;
};

const addPlayerToTable = (player: PlayerBack): void => {
  try {
    const row: HTMLTableRowElement = document.createElement("tr");

    const playerNameTd: HTMLTableCellElement = createTableCell(
      player.playerName
    );
    const positionTd: HTMLTableCellElement = createTableCell(player.position);
    const pointsTd: HTMLTableCellElement = createTableCell(
      player.points.toString()
    );
    const twoPercentTd: HTMLTableCellElement = createTableCell(
      `${player.twoPercent}%`
    );
    const threePercentTd: HTMLTableCellElement = createTableCell(
      `${player.threePercent}%`
    );
    const actionTd: HTMLTableCellElement = createActionCell(player);

    row.appendChild(playerNameTd);
    row.appendChild(positionTd);
    row.appendChild(pointsTd);
    row.appendChild(twoPercentTd);
    row.appendChild(threePercentTd);
    row.appendChild(actionTd);

    playersTableBody.appendChild(row);
  } catch (error) {
    console.error("Error adding player to table:", error);
  }
};

const createActionCell = (player: PlayerBack): HTMLTableCellElement => {
  const cell: HTMLTableCellElement = document.createElement("td");
  const addButton: HTMLButtonElement = document.createElement("button");

  addButton.textContent = `Add ${getFirstName(
    player.playerName
  )} to Current Team`;
  addButton.addEventListener("click", () => addPlayerToTeam(player));

  cell.appendChild(addButton);
  return cell;
};

const addPlayerToTeam = (player: PlayerBack): void => {
  try {
    const existingPlayer = team[player.position];

    if (existingPlayer) {
      const confirmSwitch: boolean = confirm(
        `You already have a ${player.position}. Do you want to replace ${existingPlayer.playerName} with ${player.playerName}?`
      );

      if (confirmSwitch) {
        team[player.position] = player;
        updateTeamDisplay();
      }
    } else {
      team[player.position] = player;
      updateTeamDisplay();
    }
  } catch (error) {
    console.error("Error adding player to team:", error);
  }
};

const updateTeamDisplay = (): void => {
  try {
    for (const card of playerCards) {
      const position = card.id;
      const playerInfo = team[position];

      if (playerInfo) {
        updatePlayerCard(card, playerInfo);
      }
    }
  } catch (error) {
    console.error("Error updating team display:", error);
  }
};

const updatePlayerCard = (
  card: HTMLDivElement,
  playerInfo: PlayerBack
): void => {
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
  } catch (error) {
    console.error("Error updating player card:", error);
  }
};

searchBtn.addEventListener("click", (e: Event): void => {
  e.preventDefault();
  searchPlayers();
});

const getFirstName = (fullName: string): string => {
  return fullName.split(" ")[0];
};
