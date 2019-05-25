let players = {}
let ratings = []
let sets = []
let filterDays = -1;

function displayPlayerRanking() {
    let mostRecentPlayerRating = {}

    // There's very likely a better way to do this.
    ratings.forEach(function(rating) {
        if (!(rating["player_id"] in mostRecentPlayerRating)) {
            mostRecentPlayerRating[rating["player_id"]] = {
                "day": rating["day"],
                "rating": rating["rating"],
            }
        }

        if (mostRecentPlayerRating[rating["player_id"]]["day"] < rating["day"]) {
            mostRecentPlayerRating[rating["player_id"]] = {
                "day": rating["day"],
                "rating": rating["rating"],
            }
        }
    });

    let ranking = Object.keys(mostRecentPlayerRating).map(function(key) {
        return {
            "player_id": key,
            "day": mostRecentPlayerRating[key]["day"],
            "rating": mostRecentPlayerRating[key]["rating"],
        }
    });

    ranking.sort(function(first, second) {
        return second["rating"] - first["rating"];
    });

    $(".player-rankings-list").empty();
    ranking.forEach(function(rank, index) {
        $("player-rankings-list").append("<div class='player-ranking'>" + (index + 1) + " - " + players[rank["player_id"]] + ": " + rank["rating"] + "</div>");
    });
}

function update() {
    if (players.length == 0 || ratings.length == 0 || sets.length == 0) {
        return;
    }

    displayPlayerRanking();
}

fetch("data/player.csv").then(response => response.text()).then(text => {
    let parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });

    players = parsed["data"].reduce(function(map, obj) {
        map[obj["id"]] = obj["name"];
        return map;
    }, {});
    update();
});

fetch("data/rating.csv").then(response => response.text()).then(text => {
    let parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });

    ratings = parsed["data"];
    update();
});

fetch("data/sets.csv").then(response => response.text()).then(text => {
    let parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    });

    sets = parsed["data"];
    update();
});


