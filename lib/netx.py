import networkx as nx

G = nx.Graph()

# adding nodes
G.add_node(1)
G.add_node(2)

# adding edges
G.add_edge(1, 2)

# get cliques
nx.find_cliques(G)

nx.connected_components(G)
