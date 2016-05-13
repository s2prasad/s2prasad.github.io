var playStation = {
  current_page : 1,
  records_per_page : 5,
  len :0,
  page: 1,
  streams: {},

  prevPage: function (){
      if (this.current_page > 1) {
          this.current_page--;
          this.buildHTML(this.current_page);
      }
    },

  nextPage: function (){
    if (this.current_page < this.numPages()) {
        this.current_page++;
        this.buildHTML(this.current_page);
    }
  },

//Calculates the number of pages
  numPages:function (){
    return Math.ceil(this.len / this.records_per_page);
  },

  searchTxt: function(){
    var searchText= document.getElementById('searchText').value;
    var searchResult = document.getElementsByClassName('searchResult');

    if(searchText != ""){
      document.getElementById('loading').style.display = 'block';      
      //Clear innerHTML of searchResult
      searchResult[0].innerHTML = "";
      //Build URL based on entered text
      var url = 'https://api.twitch.tv/kraken/search/streams?q='+
      searchText+'&format=json&callback=playStation.processData';
      this.requestJSONP(url);
    }
    else{
      //if search text is empty
      var errMessage = document.createElement('p');
      var errText = document.createTextNode("Enter Search Text");
      //Clear the results

      searchResult[0].innerHTML = "";
      var results = document.getElementById('results');
      results.style.display = 'none';
      var pagination = document.getElementById('pagination');
      pagination.style.display = 'none';

      //Display error message
      errMessage.appendChild(errText);
      searchResult[0].appendChild(errMessage);
    }
  },
 
  requestJSONP: function(url){
    var script = document.createElement('script');
      script.src = url;
      
      // after the script is loaded (and executed), remove it
      script.onload = function () {
        this.remove();
      };
      
      // insert script tag into the DOM (append to <head>)
      var head = document.getElementsByTagName('head')[0];
      head.appendChild(script);
  },

  processData: function(data){
      
      this.streams = data.streams; 
      this.len= this.streams.length;

      var results = document.getElementById('results');
      results.style.display = 'block';

      //Display Pagination
      var pagination = document.getElementById('pagination');
      pagination.style.display = 'block';
      var pageTotal = document.getElementById('pageTotal');
      pageTotal.innerHTML = this.numPages();

      //Display Toatl Results
      var totalResults = document.getElementById('totalResults');
      totalResults.innerHTML= this.len;
      this.buildHTML(this.current_page);
      
  },

  buildHTML: function(page){
      var parentDiv = document.getElementsByClassName('searchResult')[0];
      parentDiv.innerHTML = "";
      var page_span = document.getElementById("page");
      page_span.innerHTML = this.current_page;

      //Check if page number goes out of bound
      if (page < 1) page = 1;
      if (page > this.numPages()) page = this.numPages();

      document.getElementById('loading').style.display = 'none';

      //Display elements per page
      for (var i = (page-1) * this.records_per_page; i < (page * this.records_per_page); i++) {
        if(this.streams[i]!="" && this.streams[i]!= undefined)
          {
            var sectionItem = document.createElement('section');
            var descriptionDiv = document.createElement('div');
            descriptionDiv.className="descriptionDiv";

            parentDiv.appendChild(sectionItem);

            var imageDiv = document.createElement('div');
            imageDiv.className = "imageDiv";

            var imgTag = document.createElement('img');
            imgTag.src = this.streams[i].preview.medium;
            imgTag.alt = this.streams[i].game;

            sectionItem.appendChild(imageDiv);
            imageDiv.appendChild(imgTag);
            sectionItem.appendChild(descriptionDiv);

            var gameName = document.createElement("h3");
            gameName.className = "gameName";

            var gameNameText = document.createTextNode(this.streams[i].game);
            gameName.appendChild(gameNameText);

            var displayName = document.createElement("p");
            displayName.className = "displayName";

            var displayNameText = document.createTextNode(this.streams[i].channel.display_name+" - "+ this.streams[i].viewers +" viewers");
            displayName.appendChild(displayNameText);

            var description = document.createElement("p");
            description.className = "description";

            var descriptionText = document.createTextNode("Stream Channel: Views - "+ this.streams[i].channel.views +", Followers - "+this.streams[i].channel.followers+", URL: "+ this.streams[i].channel.url);
            description.appendChild(descriptionText);

            descriptionDiv.appendChild(gameName);
            descriptionDiv.appendChild(displayName);
            descriptionDiv.appendChild(description);
          }
      }
  }
};
    