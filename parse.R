# Essentially we want a list of stops with the routes included
# To do this with the SFMTA data we will have to break it down

# Load SFMTA data into frames
muni_stops <- read.csv("./rawdata/muni/stops.txt")
muni_stop_times <- read.csv("./rawdata/muni/stop_times.txt")
muni_routes <- read.csv("./rawdata/muni/routes.txt")
muni_trips <- read.csv("./rawdata/muni/trips.txt")

# Join data
trips_routes <- merge(muni_trips, muni_routes, by = "route_id")
trips_routes_stop_times <- merge(trips_routes, muni_stop_times, by = "trip_id")
full_dataset <- merge(trips_routes_stop_times, muni_stops, by = "stop_id")

# Limit to what we want
#   stop_id, route_id, route_short_name, route_long_name
#   route_type, stop_name, stop_lat, stop_lon
muni_routes_stops <- unique(full_dataset[c(1, 3, 10, 11, 13, 24, 26, 27)])

# Clean up workspace
remove("muni_stops", "muni_stop_times", "muni_routes", "muni_trips", 
       "trips_routes", "trips_routes_stop_times", "full_dataset")

# Break up BART API data, which is given in XML
require(XML)

bart_xml_data <- XML::xmlParse('./rawdata/bartstation.xml')
bart_xml_top <- XML::xmlRoot(bart_xml_data)
bart_stations <- XML::xmlToDataFrame(bart_xml_top[[2]])
remove("bart_xml_data", "bart_xml_top")

# This gives us two datasets, bart_stations and muni_routes_stops

# Begin SFstations
sfstations <- subset(bart_stations, county == "sanfrancisco")
sfstations <- bart_stations[c(3,4)]
names(sfstations)[1] <- "stop_lat"
names(sfstations)[2] <- "stop_lon"
sfstations$stop_lat <- as.numeric(as.character(sfstations$stop_lat))
sfstations$stop_lon <- as.numeric(as.character(sfstations$stop_lon))

# Route types in SFMTA database:
#   0 = Trolley/Streetcar
#   3 = Bus/Trackless Trolley
#   5 = Cable car
# To this we add the BART as type 6
sfstations$route_type = 6

# Combine with MUNI data
sfstations <- rbind(sfstations, muni_routes_stops[c(7,8,5)])

# Clean up
sfstations <- unique(sfstations)
remove("muni_routes_stops", "bart_stations")