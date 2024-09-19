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

const searchPlayer = async (): Promise<void> => {
  const position = positionSelect.value;
  const points = pointsRange.value;
  const twoPercent = fgRange.value;
  const threePercent = threePointRange.value;

  const searchParams: PlayerSearch = {
    position: position,
    twoPercent: parseInt(twoPercent),
    threePercent: parseInt(threePercent),
    points: parseInt(points),
  };
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch players.");
    }

    const players: PlayerBack[] = await response.json();
    displayPlayers(players);
  } catch (error) {
    console.log(error);
  }
};

const displayPlayers = (players: PlayerBack[]): void => {
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
    addButton.onclick = () =>
      addPlayerToTeam(
        player.playerName,
        player.position,
        player.points,
        player.twoPercent,
        player.threePercent
      );
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
const addPlayerToTeam = (
  playerName: string,
  position: string,
  points: number,
  twoPercent: number,
  threePercent: number
) => {
  const team = JSON.parse(localStorage.getItem("fantasyTeam") || "[]");
  if (team[position]) {
    const confirmSwitch = confirm(
      `You already have a ${position}. Do you want to replace ${team[position].playerName} with ${playerName}?`
    );
    if (!confirmSwitch) {
      return;
    }
  }
  team[position] = { playerName, points, twoPercent, threePercent };
  localStorage.setItem("fantasyTeam", JSON.stringify(team));
  updateTeamDisplay();
};

const updateTeamDisplay = (): void => {
  const team = JSON.parse(localStorage.getItem("fantasyTeam") || "[]");
  for (const card of playerCards) {
    const position = card.id;
    const playerInfo = team[position];

    if (playerInfo) {
      card.querySelector("p:nth-child(2)")!.textContent = playerInfo.playerName;
      card.querySelector(
        "p:nth-child(3)"
      )!.textContent = `Points: ${playerInfo.points}`;
      card.querySelector(
        "p:nth-child(4)"
      )!.textContent = `Two Percent: ${playerInfo.twoPercent}%`;
      card.querySelector(
        "p:nth-child(5)"
      )!.textContent = `Three Percent: ${playerInfo.threePercent}%`;
    } else {
      card.querySelector("p:nth-child(2)")!.textContent = "";
      card.querySelector("p:nth-child(3)")!.textContent = "";
      card.querySelector("p:nth-child(4)")!.textContent = "";
      card.querySelector("p:nth-child(5)")!.textContent = "";
    }
  }
};
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchPlayer();
});
