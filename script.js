const apiUrl = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=';
const lookupUrl = 'https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=';
let selectedPlayers = [];
const maxSelection = 10;

document.addEventListener('DOMContentLoaded', () => {
    searchPlayers('');
});

function searchPlayers(query) {
    fetch(`${apiUrl}${query}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.player && data.player.length > 0) {
                displayPlayers(data.player.slice(0, 11)); 
            } else {
                alert('No players found');
            }
        })
        .catch(error => console.error('Error fetching players:', error));
}

function displayPlayers(players) {
    const container = document.getElementById('playersContainer');
    container.innerHTML = '';
    players.forEach(player => {
        const description = player.strDescriptionEN ? player.strDescriptionEN.split(' ').slice(0, 10).join(' ') + '...' : 'No description available';
        const card = document.createElement('div');
        card.className = 'col-md-4 d-flex align-items-stretch';
        card.innerHTML = `
            <div class="card">
                <img src="${player.strThumb}" class="card-img-top player-img" alt="${player.strPlayer}">
                <div class="card-body">
                    <h5 class="card-title">${player.strPlayer}</h5>
                    <p class="card-text">Nationality: ${player.strNationality}</p>
                    <p class="card-text">Team: ${player.strTeam}</p>
                    <p class="card-text">Sport: ${player.strSport}</p>
                    <p class="card-text">Salary: $${Math.floor(Math.random() * 1000000)} (approx)</p>
                    <p class="card-text">Description: ${description}</p>
                    <div class="mb-2">
                        <a href="https://twitter.com/${player.strTwitter}" class="btn btn-outline-info btn-sm" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/${player.strInstagram}" class="btn btn-outline-danger btn-sm" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                    <button class="btn btn-primary mb-2" onclick="showDetails(${player.idPlayer})">Details</button>
                    <button class="btn btn-success" id="addButton${player.idPlayer}" onclick="addToGroup(${player.idPlayer}, '${player.strPlayer}')">Add to Group</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showDetails(playerId) {
    fetch(`${lookupUrl}${playerId}`)
        .then(response => response.json())
        .then(data => {
            const player = data.players[0];
            const modalBody = document.getElementById('modalBodyContent');
            modalBody.innerHTML = `
                <img src="${player.strThumb}" class="img-fluid mb-3" alt="${player.strPlayer}">
                <h5>${player.strPlayer}</h5>
                <p>Nationality: ${player.strNationality}</p>
                <p>Team: ${player.strTeam}</p>
                <p>Sport: ${player.strSport}</p>
                <p>Position: ${player.strPosition}</p>
                <p>Birth Date: ${player.dateBorn}</p>
                <p>Description: ${player.strDescriptionEN ? player.strDescriptionEN : 'No description available'}</p>

            `;
            $('#playerModal').modal('show');
        })
        .catch(error => console.error('Error fetching player details:', error));
}

function addToGroup(playerId, playerName) {
    if (selectedPlayers.length >= maxSelection) {
        alert(`You can't add more than ${maxSelection} players`);
        return;
    }
    if (selectedPlayers.includes(playerId)) {
        alert('Player is already added');
        return;
    }
    selectedPlayers.push(playerId);
    const selectedList = document.getElementById('selectedPlayersList');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = playerName;
    selectedList.appendChild(listItem);
    document.getElementById('selectedCount').textContent = selectedPlayers.length;
    const addButton = document.getElementById(`addButton${playerId}`);
    addButton.textContent = 'Already Added';
    addButton.disabled = true;
}

function resetSelection() {
    selectedPlayers = [];
    document.getElementById('selectedPlayersList').innerHTML = '';
    document.getElementById('selectedCount').textContent = selectedPlayers.length;
}
