var map;
var markers = [];
// Details of marker locations
var locations = [
          {title: 'Bara Imambara', location: {lat: 26.869014, lng: 80.913062}, type: 'Tourist Spot'},
          {title: 'Janeshwar Mishra Park', location: {lat: 26.838214, lng: 80.995325}, type: 'Recreational'},
          {title: 'Vidhan Sabha UP', location: {lat: 26.843738, lng: 80.944186}, type: 'Administrative'},
          {title: 'Fun Republic Mall', location: {lat: 26.858225, lng: 80.976326}, type: 'Movies'},
          {title: 'Zoological Garden', location: {lat: 26.845683, lng: 80.954647}, type: 'Tourist Spot'},
          {title: 'Lucknow Airport', location: {lat: 26.761732, lng: 80.885655}, type: 'Others'},
          {title: 'Tundey Kababi', location: {lat: 26.848305, lng: 80.927307}, type: 'Food'},
          {title: 'Wave Cinemas', location:{lat: 26.869591, lng: 80.997331}, type: 'Movies'},
          {title: 'Hazaratganj', location:{lat: 26.856447, lng: 80.945655}, type: 'Markets'},
          {title: 'High Court, lucknow bench', location:{lat: 26.871697, lng: 81.009611}, type: 'Administrative'}
        ];
/**
* @description creates a map and apply bindings
*/
function initMap(){
	// Creating a new map
	map = new google.maps.Map(document.getElementById('map'),{
		center: {lat: 26.8690, lng: 80.9131},
          zoom: 12
	});

	ko.applyBindings(new ViewModel());

}

// Makes the marker icon bounce twice
function toggleBounce(marker){
	marker.setAnimation(google.maps.Animation.BOUNCE);
	window.setTimeout(function(){marker.setAnimation(null)},1400);
}

/**
* @description Gets information about the location from Wikipedia
* @param location - name of the location
* @param infowindow - infowindow of marker of the location
*/
function getFromWiki(location,infowindow){

	var content = location + ' <hr> Wikipedia Articles:<br>';

	// If there is no response in 8 seconds, Error message is displayed
	var wikitimeout = setTimeout(function(){
		content += '<h4>Your request failed to load </h4> '
        infowindow.setContent(content);
    }, 8000);

	// AJAX request to English Wikipedia API
    var wikiurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+location+"&format=json";
    $.ajax({
        url: wikiurl,
        dataType: 'jsonp',
        success: function(response){
            articles = response[1];
            if(articles.length == 0){
            	content += '<br>No Result found';
            	infowindow.setContent(content);
            };
            for (var i = 0; i <articles.length; i++) {
            	content += '<li><a href="https://en.wikipedia.org/wiki/'+articles[i]+'">'+articles[i]+'</a></li>';
                infowindow.setContent(content);
            };

        clearTimeout(wikitimeout);
        }
    })
}

/**
* @description Filters both list view and markers using string
* @param find - string which is to be searched
* @param list - stores details of marker location
*/
var filterList = function (find, list){
	for(var i=0; i<list.length; i++){
		if (list[i].title().toUpperCase().indexOf(find.toUpperCase()) > -1){
			list[i].show(true);
			markers[i].setMap(map);
		}else{
			list[i].show(false);
			markers[i].setMap(null);
		}
	}
}

/**
* @description Filters both list view and markers using type
* @param find - type selected which is to be searched
* @param list - stores details of marker location
*/
var filterType = function (find, list){
	for(var i=0; i<list.length; i++){
		if (list[i].type() === find[0] | find[0] === 'By Type'){
			list[i].show(true);
			markers[i].setMap(map);
		}else{
			list[i].show(false);
			markers[i].setMap(null);
		}
	}
}

/**
* @description - List contains details of location
* @param data - contains details of location extracted from locations array
* @param i - index number
* @param win - infowindow of the marker of this location
* @param favValue - Boolean- tells if the list item is favorite or not
*/
var List = function(data, i, win, favValue){
	this.location = ko.observable(data.location);
	this.title = ko.observable(data.title);
	this.index = ko.observable(i);
	this.infowin = ko.observable(win);
	this.show = ko.observable(true);
	this.type = ko.observable(data.type);
	this.fav = ko.observable(favValue);
}

var ViewModel = function(){
	var self = this;
	// It will store all the List items
	this.list_items = ko.observableArray([]);
	// Array of types
	this.type = ko.observableArray(['By Type','Tourist Spot', 'Recreational', 'Administrative', 'Movies','Markets', 'Food', 'Others' ])
	// Setting the value of favVal in local storage as per initial conditions
	if(!(localStorage.getItem('favVal'))){
		this.favlist = ko.observableArray([false,false,false,false,false,false,false,false,false,false]);
			localStorage.setItem('favVal',JSON.stringify({val: this.favlist()}));
		}else{
		this.favlist = JSON.parse(localStorage.getItem('favVal')).val;
		}

	var bounds = new google.maps.LatLngBounds();
	for(var i = 0; i < locations.length; i++){
		var iconstyle = '';
		// Custom Icon depending upon type of locations
		if(locations[i].type === 'Movies'){
			iconstyle = 'http://maps.google.com/mapfiles/kml/pal2/icon30.png';
		}else if(locations[i].type === 'Others'){
			iconstyle = 'http://maps.google.com/mapfiles/kml/pal2/icon56.png';
		}else if(locations[i].type === 'Markets'){
			iconstyle = 'http://maps.google.com/mapfiles/kml/pal4/icon4.png';
		}else if(locations[i].type === 'Tourist Spot'){
			iconstyle = 'http://maps.google.com/mapfiles/kml/pal2/icon39.png';
		}else if(locations[i].type === 'Recreational'){
			iconstyle = 'http://maps.google.com/mapfiles/kml/pal2/icon4.png';
		}else if(locations[i].type === 'Administrative'){
			iconstyle = 'http://maps.google.com/mapfiles/kml/pal3/icon21.png';
		}else if(locations[i].type === 'Food'){
			iconstyle = 'http://maps.google.com/mapfiles/kml/pal2/icon32.png';
		}
		// Creating markers
		marker = new google.maps.Marker({
          position: locations[i].location,
          title:locations[i].title,
          map: map,
          icon: iconstyle
        });
        bounds.extend(marker.position);
        markers.push(marker);
		// creating a new info window
		var infowindow = new google.maps.InfoWindow({
			content:marker.title
		});

		// Opens and closes the info window and makes marker bounce
		marker.addListener('click', function(){
			toggleBounce(this);
			infowindow.open(map,this);
			getFromWiki(this.title,infowindow);
		});

		self.list_items.push(new List(locations[i],i,infowindow,self.favlist[i]));

	}
	map.fitBounds(bounds);

	// Animates the marker and show infowindow when an item is clicked in the list
	this.itemClick = function(item){
		toggleBounce(markers[item.index()]);
		item.infowin().open(map,markers[item.index()]);
		getFromWiki(item.title(),item.infowin());
	}

	// Filters markers and list view by input string
	this.filterVal = ko.observable("");
	this.filter = function(){
		filterList(self.filterVal(), self.list_items());
	}
	// Filters markers and list view by type
	this.selected = ko.observableArray();
	this.filterByType = function(){
		filterType(self.selected(), self.list_items());
	}

	// Toggles favorite and stores it in local storage
	this.favorite = function(){
		if(this.fav()){
			this.fav(false);
		}else{
			this.fav(true);
		}
		self.list_items().forEach(function(elem,i){
			self.favlist[i] = elem.fav();
		},self)
		localStorage.setItem('favVal',JSON.stringify({val: self.favlist}));
	}
}

