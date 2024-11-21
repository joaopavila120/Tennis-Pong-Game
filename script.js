// João Paulo de Avila
// 178898

function previewImage(inputElement, previewElementId) {
    var file = inputElement.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var imgElement = document.getElementById(previewElementId);
            imgElement.src = event.target.result;
            imgElement.style.display = 'block';

            localStorage.setItem(previewElementId + 'Data', event.target.result);
        }
        reader.readAsDataURL(file);
    }
}

document.getElementById('player1Photo').addEventListener('change', function() {
    previewImage(this, 'player1Preview');
});

document.getElementById('player2Photo').addEventListener('change', function() {
    previewImage(this, 'player2Preview');
});

document.getElementById('startGameButton').addEventListener('click', function() {

    var player1Name = document.getElementById('player1Name').value || 'Jogador 1';
    var player2Name = document.getElementById('player2Name').value || 'Jogador 2';


    var starter = document.querySelector('input[name="starter"]:checked');
    if (!starter) {
        alert('Por favor, selecione quem começa o jogo.');
        return;
    }
    var startingPlayer = starter.value;


    var player1PhotoData = localStorage.getItem('player1PreviewData') || 'default_player1.png';
    var player2PhotoData = localStorage.getItem('player2PreviewData') || 'default_player2.png';

    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
    localStorage.setItem('player1Image', player1PhotoData);
    localStorage.setItem('player2Image', player2PhotoData);
    localStorage.setItem('startingPlayer', startingPlayer);


    window.location.href = 'game/game.html';
});

document.getElementById('startGameButton').addEventListener('click', function() {

    var player1Name = document.getElementById('player1Name').value || 'Jogador 1';
    var player2Name = document.getElementById('player2Name').value || 'Jogador 2';

    var starter = document.querySelector('input[name="starter"]:checked');
    if (!starter) {
        alert('Por favor, selecione quem começa o jogo.');
        return;
    }
    var startingPlayer = starter.value;

    var player1PhotoFile = document.getElementById('player1Photo').files[0];
    var player2PhotoFile = document.getElementById('player2Photo').files[0];

    function getBase64(file, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            callback(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Erro ao converter imagem: ', error);
        };
    }

    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);

    if (player1PhotoFile) {
        getBase64(player1PhotoFile, function(base64Image) {
            localStorage.setItem('player1Photo', base64Image);
        });
    }

    if (player2PhotoFile) {
        getBase64(player2PhotoFile, function(base64Image) {
            localStorage.setItem('player2Photo', base64Image);
        });
    }

    setTimeout(function() {
        window.location.href = '/game/game.html';
    }, 500);
});

