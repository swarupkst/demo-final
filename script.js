// Assuming you're using fetch API
function fetchData() {
    return fetch('https://raw.githubusercontent.com/your-username/your-repository/main/data.json')
        .then(response => response.json())
        .catch(error => console.error('Error fetching data:', error));
}

function submitVote() {
    if (hasVoted) {
        alert("You have already voted. Each person can only vote once.");
        return;
    }

    var selectedOption = document.querySelector('input[name="vote"]:checked');
    if (selectedOption) {
        voteCounts[selectedOption.value]++;
        alert("Vote submitted for " + selectedOption.value);
        hasVoted = true;

        // Update vote counts in the JSON file on GitHub
        updateData();
    } else {
        alert("Please select an option before submitting your vote.");
    }
}

function updateData() {
    fetchData().then(data => {
        data.voteCounts = voteCounts;
        data.hasVoted = hasVoted;

        fetch('https://api.github.com/repos/your-username/your-repository/contents/data.json', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer your-github-token', // Replace with your GitHub Personal Access Token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Update vote data',
                content: btoa(JSON.stringify(data)),
                sha: data.sha
            })
        })
        .then(response => response.json())
        .then(result => console.log('Data updated successfully:', result))
        .catch(error => console.error('Error updating data:', error));
    });
}

function showVotes() {
    fetchData().then(data => {
        var countDisplay = document.getElementById('voteCount');
        countDisplay.innerHTML = "Vote Counts: <br>" +
            "Option 1: " + data.voteCounts.option1 + "<br>" +
            "Option 2: " + data.voteCounts.option2 + "<br>" +
            "Option 3: " + data.voteCounts.option3;
    });
}
