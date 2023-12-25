import networkx as nx

# Assuming G is your graph
G = nx.Graph()

file = open("input.txt", "r")

# set
nodesnames = set()

# read file
for line in file:
    # split line
    line = line.split(": ")
    nodesnames.add(line[0])

    # split result
    result = line[1].split(" ")
    for i in range(len(result)):
        result[i] = result[i].replace("\n", "")
        nodesnames.add(result[i])


# add nodes
for node in nodesnames:
    G.add_node(node)

# read file
file = open("input.txt", "r")

# add edges
for line in file:
    # split line
    line = line.split(": ")

    # split result
    result = line[1].split(" ")
    for i in range(len(result)):
        result[i] = result[i].replace("\n", "")
        G.add_edge(line[0], result[i])

edge_betweenness = nx.edge_betweenness_centrality(G)
print("Edge betweenness: ", edge_betweenness)
sorted_edges = sorted(edge_betweenness.items(),
                      key=lambda item: item[1], reverse=True)
edges_to_remove = [edge for edge, centrality in sorted_edges[:3]]
G.remove_edges_from(edges_to_remove)
components = nx.connected_components(G)
components = list(components)
print("Size of the two components: ", len(components[0]), len(components[1]))
