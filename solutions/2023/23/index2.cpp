#include <iostream>
#include <string>
#include <vector>
#include <deque>
#include <fstream>
#include <algorithm>

using namespace std;
using std::cout;

const uint16_t GRID_SIDE = 141;

struct BFSState
{
  uint16_t i;
  uint16_t j;
  uint16_t dist;

  BFSState(uint16_t i, uint16_t j, uint16_t dist)
  {
    this->i = i;
    this->j = j;
    this->dist = dist;
  }
};

struct DFSState
{
  uint16_t node;
  uint16_t dist;
  bool *seen;

  DFSState(uint16_t node, uint16_t dist, bool *seen)
  {
    this->node = node;
    this->dist = dist;
    this->seen = seen;
  }
};

int main()
{
  ifstream file("input.txt");

  // FIXME: investigate more performant way to read file

  char raw[GRID_SIDE * GRID_SIDE + GRID_SIDE];
  file.read(raw, GRID_SIDE * GRID_SIDE + GRID_SIDE);

  char grid[GRID_SIDE * GRID_SIDE];
  // copy while removing newlines
  for (uint16_t i = 0; i < GRID_SIDE; i++)
  {
    for (uint16_t j = 0; j < GRID_SIDE; j++)
    {
      grid[i * GRID_SIDE + j] = raw[i * (GRID_SIDE + 1) + j];
    }
  }

  vector<pair<uint16_t, uint16_t>> intersections;

  // look for tiles with > 2 neighbors
  for (uint16_t i = 1; i < GRID_SIDE; i += 2)
  {
    for (uint16_t j = 1; j < GRID_SIDE; j += 2)
    {
      if (grid[i * GRID_SIDE + j] != '#')
      {
        uint16_t neighbors = 0;
        if (grid[(i - 1) * GRID_SIDE + j] != '#')
          neighbors++;
        if (grid[(i + 1) * GRID_SIDE + j] != '#')
          neighbors++;
        if (grid[i * GRID_SIDE + j - 1] != '#')
          neighbors++;
        if (grid[i * GRID_SIDE + j + 1] != '#')
          neighbors++;

        if (neighbors > 2)
        {
          intersections.push_back(make_pair(i, j));

          // mark this is an X on the grid for easy lookup
          grid[i * GRID_SIDE + j] = 'X';
        }
      }
    }
  }

  // construct an adjacency matrix
  uint16_t numIntersections = intersections.size();
  uint16_t *adjMatrix = new uint16_t[numIntersections * numIntersections];

  // fill with 60000 -> this is our Infinity
  fill(adjMatrix, adjMatrix + numIntersections * numIntersections, 60000);

  // shortest distances from start and end
  uint16_t closestStart = 60000;
  uint16_t closestEnd = 60000;
  uint16_t closestStartInd = 0;
  uint16_t closestEndInd = 0;

  uint16_t start[2] = {0, 1};
  uint16_t end[2] = {GRID_SIDE - 1, GRID_SIDE - 2};

  // for every node, find the shortest path to every other node
  for (uint16_t ind = 0; ind < numIntersections; ind++)
  {
    uint16_t i = intersections[ind].first;
    uint16_t j = intersections[ind].second;

    // BFS
    deque<BFSState> queue;
    queue.push_back({i, j, 0});

    // seen array
    bool *seen = new bool[GRID_SIDE * GRID_SIDE];
    fill(seen, seen + GRID_SIDE * GRID_SIDE, false);

    while (queue.size() > 0)
    {
      BFSState state = queue.front();
      queue.pop_front();

      uint16_t i = state.i;
      uint16_t j = state.j;
      uint16_t dist = state.dist;

      if (seen[i * GRID_SIDE + j])
        continue;
      seen[i * GRID_SIDE + j] = true;

      // if we're at an intersection, add to adjacency matrix
      if (grid[i * GRID_SIDE + j] == 'X')
      {
        uint16_t ind2 = find(intersections.begin(), intersections.end(), make_pair(i, j)) - intersections.begin();

        // if it isn't itself
        if (ind != ind2)
        {
          adjMatrix[ind * numIntersections + ind2] = dist;
          continue;
        }
      }

      // if we are at the start or end, update closest
      if (i == start[0] && j == start[1])
      {
        if (dist < closestStart)
        {
          closestStart = dist;
          closestStartInd = ind;
        }
      }
      else if (i == end[0] && j == end[1])
      {
        if (dist < closestEnd)
        {
          closestEnd = dist;
          closestEndInd = ind;
        }
      }

      // add neighbors to queue
      if (i > 0 && grid[(i - 1) * GRID_SIDE + j] != '#' && !seen[(i - 1) * GRID_SIDE + j])
        queue.push_back({i - 1, j, dist + 1});
      if (i < GRID_SIDE - 1 && grid[(i + 1) * GRID_SIDE + j] != '#' && !seen[(i + 1) * GRID_SIDE + j])
        queue.push_back({i + 1, j, dist + 1});
      if (j > 0 && grid[i * GRID_SIDE + j - 1] != '#' && !seen[i * GRID_SIDE + j - 1])
        queue.push_back({i, j - 1, dist + 1});
      if (j < GRID_SIDE - 1 && grid[i * GRID_SIDE + j + 1] != '#' && !seen[i * GRID_SIDE + j + 1])
        queue.push_back({i, j + 1, dist + 1});
    }
  }

  // find the longest path from start to end
  deque<DFSState> stack;
  stack.push_back({closestStartInd, 0, new bool[numIntersections]});
  fill(stack.back().seen, stack.back().seen + numIntersections, false);

  uint16_t longestPath = 0;

  while (stack.size() > 0)
  {
    DFSState state = stack.back();
    stack.pop_back();

    uint16_t node = state.node;
    uint16_t dist = state.dist;
    bool *seen = state.seen;

    seen[node] = true;

    if (node == closestEndInd)
    {
      if (dist > longestPath)
        longestPath = dist;
      continue;
    }

    for (uint16_t i = 0; i < numIntersections; i++)
    {
      if (adjMatrix[node * numIntersections + i] != 60000 && !seen[i])
      {
        stack.push_back({i, dist + adjMatrix[node * numIntersections + i], new bool[numIntersections]});
        copy(seen, seen + numIntersections, stack.back().seen);
      }
    }
  }

  cout << longestPath + closestStart + closestEnd << endl;
}