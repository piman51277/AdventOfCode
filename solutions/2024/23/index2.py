import networkx as nx
inputFile = open("input.txt", "r")
verts = []
edges = []
for line in inputFile:
    line = line.strip()
    [first, second] = line.split('-')
    if first not in verts:
        verts.append(first)
    if second not in verts:
        verts.append(second)
    edges.append((first, second))
G = nx.Graph()
for vert in verts:
    G.add_node(vert)
for edge in edges:
    G.add_edge(edge[0], edge[1])
cliques = list(nx.find_cliques(G))
maxClique = []
for clique in cliques:
    if len(clique) > len(maxClique):
        maxClique = clique
maxClique.sort()
print(",".join(maxClique))
