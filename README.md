# Neighborhood Map

### What it does
* It is a one page application, which renders the map of a location.
* It displays markers for various neighborhood locations. Name of these
locations are shown in the list view. Markers are custom icons depicting
types of the locations.
* On clicking any of the markers or their name from the list, an infowindow
opens for that marker in the map. It shows name of the location and Wikipedia
articles about that place, if available.
* Above the list, there is a filter box. When the user types in it, both the
markers in the map and the place names in the list get filtered out.
* Similary if the user selects a type, list view and markers in the map are
filtered out.
* Users can favorite locations. Favorite locations remain favorite even on page
refresh.
* Place whose map is shown on opening app and markers are pre-selected.
* It is a responsive app.

### How to use this app
* Download the project from github. After going in the desired directory,
enter the following code in the terminal:
`git clone https://github.com/aditya-sin/Map-Project.git`
* Go to the newly created directory: `cd Map-Project`
* Open `index.html` to launch the app in the browser.
* A map is displayed with markers for some locations. Also, a list is diplayed of same locations.
* To see details of any location either click on the marker on the map or select
the location in the list.
* To search for a place, start typing its name in the filter box. Marker and list
both get filtered out with each charcter written in the filter box.
* Or select a type, and markers and list will be filtered.
* Click on the Star to favorite locations.
* Mobile users can view the list and filter option on clicking the hamburger menu
icon located at the top right corner of the screen. List appears at the bottom of the page.

English Wikipedia API is used to retrieve information about locations and is displayed
in info window.