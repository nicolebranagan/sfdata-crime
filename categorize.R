source("./crime.R")

trolley_matrix <- matrix(nrow = 1100, ncol = length(levels(dist_frame$category)))
bus_matrix <- matrix(nrow = 1100, ncol = length(levels(dist_frame$category)))
cable_matrix <- matrix(nrow = 1100, ncol = length(levels(dist_frame$category)))
bart_matrix <- matrix(nrow = 1100, ncol = length(levels(dist_frame$category)))

i <- 1
for (a in levels(dist_frame$category)) {
  g <- hist(dist_frame$trolley[dist_frame$category == a], breaks=seq(from=0, to=11000, by=10))
  trolley_matrix[ , i] = g$counts
  g <- hist(dist_frame$bus[dist_frame$category == a], breaks=seq(from=0, to=11000, by=10))
  bus_matrix[ , i] = g$counts
  g <- hist(dist_frame$cable[dist_frame$category == a], breaks=seq(from=0, to=11000, by=10))
  cable_matrix[ , i] = g$counts
  g <- hist(dist_frame$bart[dist_frame$category == a], breaks=seq(from=0, to=11000, by=10))
  bart_matrix[ , i] = g$counts
  i <- i + 1
}

trolley_matrix <- as.data.frame(trolley_matrix)
colnames(trolley_matrix) <- levels(dist_frame$category)
bus_matrix <- as.data.frame(bus_matrix)
colnames(bus_matrix) <- levels(dist_frame$category)
cable_matrix <- as.data.frame(cable_matrix)
colnames(cable_matrix) <- levels(dist_frame$category)
bart_matrix <- as.data.frame(bart_matrix)
colnames(bart_matrix) <- levels(dist_frame$category)

require(rjson)
write(rjson::toJSON(trolley_matrix), file="./display/trolley.json")
write(rjson::toJSON(bus_matrix), file="./display/bus.json")
write(rjson::toJSON(cable_matrix), file="./display/cable.json")
write(rjson::toJSON(bart_matrix), file="./display/bart.json")