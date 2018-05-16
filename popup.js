document.addEventListener('DOMContentLoaded', function() {
  var submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', function() {
    search();
  }, false);
  var inputBox = document.getElementById('movTitle');
  inputBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        search();
    }
    
  }, false);
}, false);

function search() {
  chrome.tabs.getSelected(null, function(tab) {
      var d = document;
      var search = document.getElementById('movTitle').value;
      var request = new XMLHttpRequest();
      var url = "http://www.omdbapi.com/?t=" + search + "&apikey=11945699";
      request.open('GET', url);
      request.responseType = 'text';

      request.onload = function() {
        var mainDivExists = document.getElementById('mainDiv');
        if (mainDivExists) {
          document.body.removeChild(mainDivExists);
        }
        var mainDiv = d.createElement('div');
        var para = d.createElement('p');
        mainDiv.id ='mainDiv';

        var myObj = JSON.parse(request.response);
        console.log(myObj);

        if(myObj.Response === 'False') {
          mainDiv.append('Sorry, no results were found.');
        } else {

          var title = myObj.Title;
          var titleP = d.createElement('p');
          titleP.id = 'title';
          titleP.style.fontSize = '1.4em';
          titleP.append(title);

          mainDiv.appendChild(titleP);

          var imdbScore, rtScore, metaScore;

          var scores = myObj.Ratings;
          for (var i = 0; i < scores.length; i++) {
              var score = scores[i];
              if (score.Source === "Internet Movie Database") {
                imdbScore = score.Value;
              } else if (score.Source === "Rotten Tomatoes") {
                rtScore = score.Value;
              } else {
                metaScore = score.Value;
              }
          }
          var scoreRowDiv = d.createElement('div');
          scoreRowDiv.className = 'row';

          var imdbDiv = d.createElement('div');
          imdbDiv.className = 'column';
          imdbDiv.append('IMDb: ' + imdbScore);
          scoreRowDiv.appendChild(imdbDiv);

          var rtDiv = d.createElement('div');
          rtDiv.className = 'column';
          rtDiv.append('RT: ' + rtScore);
          scoreRowDiv.appendChild(rtDiv);

          var mDiv = d.createElement('div');
          mDiv.className = 'column';
          mDiv.append('Metascore:  '+ metaScore);
          scoreRowDiv.appendChild(mDiv);

          mainDiv.appendChild(scoreRowDiv);

          var plot = myObj.Plot;
          var plotDiv = d.createElement('div');
          var newLine = d.createElement('br');
          plotDiv.id = 'plot';
          var plotP = d.createElement('p');
          plotP.append('Plot')
          plotP.appendChild(newLine);
          plotP.append(plot);
          plotDiv.appendChild(plotP);
          mainDiv.appendChild(plotDiv);

          var awards = myObj.Awards;
          var awardsDiv = d.createElement('div');
          awardsDiv.id = 'awards';
          var awardsP = d.createElement('p');
          awardsP.append('Awards');
          var newLine2 = d.createElement('br');

          awardsP.appendChild(newLine2);
          awardsP.append(awards);
          awardsDiv.append(awardsP);
          mainDiv.appendChild(awardsDiv);

          var imdbID = myObj.imdbID;
          var linkDiv = d.createElement('div');
          linkDiv.id = 'id';
          var linkP = d.createElement('p');
          linkP.append('Link');
          var newLine3 = d.createElement('br');

          linkP.appendChild(newLine3);
          var a = d.createElement('a');
          var linkText = document.createTextNode("https://www.imdb.com/title/"+ imdbID);
          a.appendChild(linkText);
          a.title = "https://www.imdb.com/title/"+ imdbID;
          a.href = "https://www.imdb.com/title/"+ imdbID;
          a.addEventListener('click', function() {
            chrome.tabs.create({'url': "https://www.imdb.com/title/"+ imdbID});
          }, false);
          
          linkP.appendChild(a);
          linkDiv.appendChild(linkP);
          mainDiv.appendChild(linkDiv);
        }
        var container = d.getElementById('body');
          container.appendChild(mainDiv);

      };
      request.send();
    });
}