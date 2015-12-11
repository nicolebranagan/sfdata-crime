# Load parsing script
source("./parse.R")

# Load crime data
# This file is not included in the repository due to its size, but is obtained easily from datasf.org
crimedata <- read.csv("./rawdata/sfcrime.csv")

require(geosphere)
# Calculate the geodesic distance between two points specified by radian latitude/longitude using the
# Haversine formula (hf)

min_dist <- function(stat, crimerow){
  return(
    min(
      apply(stat, 1, function(x) {
        geosphere::distHaversine(c(x[2], x[1]), c(as.numeric(crimerow[10]), as.numeric(crimerow[11])))
        }
      )
    )
  )
}

min_dist_by_type <- function(crimes, sfstations, type) {
  return(apply(crimes, 1, function(x) { 
        min_dist(subset(sfstations, route_type==type), x)
      }
    )
  )
}

# Sample a subset
crimeset = crimedata[sample(nrow(crimedata), 50000), ]

dist_fromtrolley <- min_dist_by_type(crimeset, sfstations, 0)
print("completed from trolley")
dist_from_bus <- min_dist_by_type(crimeset, sfstations, 3)
print("completed from bus")
dist_from_cable <- min_dist_by_type(crimeset, sfstations, 5)
print("completed from cable")
dist_from_bart  <- min_dist_by_type(crimeset, sfstations, 6)
print("completed from bart")

dist_frame <- data.frame(category = crimeset$Category, trolley = dist_fromtrolley, bus = dist_from_bus, cable = dist_from_cable, bart = dist_from_bart)
dist_frame$min <- apply(dist_frame, 1, min)

# Clean data
# First we remove the hall of Justice, a clear outlier
dist_frame <- dist_frame[crimeset$Location != '(37.775420706711, -122.403404791479)', ]
crimeset <- crimeset[crimeset$Location != '(37.775420706711, -122.403404791479)', ]

# Then we remove anything with bad location data
crimeset <- crimeset[dist_frame$bus < 8000, ]
dist_frame <- dist_frame[dist_frame$bus < 8000, ]

write.csv(dist_frame, './min_dist.csv')