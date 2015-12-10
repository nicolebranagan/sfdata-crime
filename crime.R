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
crimeset = crimedata[sample(nrow(crimedata), 10000), ]

dist_fromtrolley <- min_dist_by_type(crimeset, sfstations, 0)
print("completed from trolley")
dist_from_bus <- min_dist_by_type(crimeset, sfstations, 3)
print("completed from bus")
dist_from_cable <- min_dist_by_type(crimeset, sfstations, 5)
print("completed from cable")
dist_from_bart  <- min_dist_by_type(crimeset, sfstations, 6)
print("completed from bart")
