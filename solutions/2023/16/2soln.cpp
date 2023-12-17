#include <iostream>
#include <string>
#include <vector>
#include <queue>

using namespace std;
using std::cout;
using std::fill;

// in this case, our input size is known
constexpr int WIDTH = 110;
constexpr int HEIGHT = 110;

constexpr int GRID_SIZE = WIDTH * HEIGHT;

constexpr int SCAN_MAX = (WIDTH + HEIGHT) * 2;

constexpr int THREAD_COUNT = 20;
constexpr int BLOCK_SIZE = SCAN_MAX / THREAD_COUNT;

// we know roughly 12% of the grid will be filled with non spaces.
// Allocate 15% to be safe
// each mirror can have a max of 4 beams
// also add the number of edges
constexpr int BEAM_MAX = (float)GRID_SIZE * 0.15 * 4 + SCAN_MAX;

// direction enum
//  0 = up
//  1 = right
//  2 = down
//  3 = left

struct Beam
{
  uint16_t x;
  uint16_t y;
  uint8_t dir;

  Beam(uint16_t x, uint16_t y, uint8_t dir) : x(x), y(y), dir(dir) {}

  Beam() : x(0), y(0), dir(0) {}

  int offset() const
  {
    return (y * WIDTH + x) * 4 + dir;
  }
};

struct BeamEntry
{
  uint8_t pop; // how many children have been populated -1
  Beam child1;
  Beam child2;
  int16_t energizedBegin;
  int16_t energizedEnd;

  BeamEntry() : pop(0), child1(), child2(), energizedBegin(-1), energizedEnd(-1) {}
};

int scanFromBeam(Beam b, uint8_t *grid, int32_t *beamIndex, BeamEntry *beamCache, int *nextIndex)
{
  static int hits = 0;
  static int misses = 0;

  // a copy of the grid that stores on/off
  uint16_t energized[GRID_SIZE];
  fill(energized, energized + GRID_SIZE, 0);

  // array that stores whether or not we've seen a certain beam
  uint16_t seen[GRID_SIZE * 4];
  fill(seen, seen + GRID_SIZE * 4, 0);

  // queue of beams to process
  queue<Beam> q;
  q.push(b);

  while (q.size() > 0)
  {
    const Beam &b = q.front();
    q.pop();

    const uint16_t &x = b.x;
    const uint16_t &y = b.y;
    const uint16_t &dir = b.dir;
    const int offset = b.offset();

    if (beamIndex[offset] != -1)
    {
      hits++;

      int32_t index = beamIndex[offset];
      Beam child1 = beamCache[index].child1;
      Beam child2 = beamCache[index].child2;

      if (beamCache[index].pop == 2)
      {
        if (seen[child1.offset()] == 0)
        {
          seen[child1.offset()] = 1;
          q.push(child1);
        }
      }
      else if (beamCache[index].pop == 3)
      {
        if (seen[child1.offset()] == 0)
        {
          seen[child1.offset()] = 1;
          q.push(child1);
        }
        if (seen[child2.offset()] == 0)
        {
          seen[child2.offset()] = 1;
          q.push(child2);
        }
      }

      // populate the energized array
      if (beamCache[index].energizedBegin != -1)
      {
        // by direction
        if (dir == 0)
        {
          for (int i = beamCache[index].energizedBegin; i >= beamCache[index].energizedEnd; i -= WIDTH)
          {
            energized[i] = 1;
          }
        }
        else if (dir == 1)
        {
          for (int i = beamCache[index].energizedBegin; i <= beamCache[index].energizedEnd; i++)
          {
            energized[i] = 1;
          }
        }
        else if (dir == 2)
        {
          for (int i = beamCache[index].energizedBegin; i <= beamCache[index].energizedEnd; i += WIDTH)
          {
            energized[i] = 1;
          }
        }
        else if (dir == 3)
        {
          for (int i = beamCache[index].energizedBegin; i >= beamCache[index].energizedEnd; i--)
          {
            energized[i] = 1;
          }
        }
      }

      continue;
    }
    misses++;

    vector<Beam> next;
    next.reserve(2);

    uint16_t energizedBegin = y * WIDTH + x;
    uint16_t energizedEnd = -1;

    // up
    if (dir == 0)
    {
      for (int i = y; i >= 0; --i)
      {
        int loc = i * WIDTH + x;
        energized[loc] = 1;
        energizedEnd = loc;

        if (grid[loc] == 1)
        {
          if (x < WIDTH - 1)
            next.emplace_back(x + 1, i, 1);
        }
        else if (grid[loc] == 2)
        {
          if (x > 0)
            next.emplace_back(x - 1, i, 3);
        }
        else if (grid[loc] == 4)
        {
          if (x < WIDTH - 1)
            next.emplace_back(x + 1, i, 1);
          if (x > 0)
            next.emplace_back(x - 1, i, 3);
        }
        else
        {
          continue;
        }
        break;
      }
    }

    // down
    else if (dir == 2)
    {
      for (int i = y; i < HEIGHT; ++i)
      {
        int loc = i * WIDTH + x;
        energized[loc] = 1;
        energizedEnd = loc;

        if (grid[loc] == 1)
        {
          if (x > 0)
            next.emplace_back(x - 1, i, 3);
        }
        else if (grid[loc] == 2)
        {
          if (x < WIDTH - 1)
            next.emplace_back(x + 1, i, 1);
        }
        else if (grid[loc] == 4)
        {
          if (x > 0)
            next.emplace_back(x - 1, i, 3);
          if (x < WIDTH - 1)
            next.emplace_back(x + 1, i, 1);
        }
        else
        {
          continue;
        }
        break;
      }
    }

    // right
    else if (dir == 1)
    {
      for (int i = x; i < WIDTH; ++i)
      {
        int loc = y * WIDTH + i;
        energized[loc] = 1;
        energizedEnd = loc;

        if (grid[loc] == 1)
        {
          if (y > 0)
            next.emplace_back(i, y - 1, 0);
        }
        else if (grid[loc] == 2)
        {
          if (y < HEIGHT - 1)
            next.emplace_back(i, y + 1, 2);
        }
        else if (grid[loc] == 3)
        {
          if (y > 0)
            next.emplace_back(i, y - 1, 0);
          if (y < HEIGHT - 1)
            next.emplace_back(i, y + 1, 2);
        }
        else
        {
          continue;
        }
        break;
      }
    }

    // left
    else if (dir == 3)
    {
      for (int i = x; i >= 0; --i)
      {
        int loc = y * WIDTH + i;
        energized[loc] = 1;
        energizedEnd = loc;

        if (grid[loc] == 1)
        {
          if (y < HEIGHT - 1)
            next.emplace_back(i, y + 1, 2);
        }
        else if (grid[loc] == 2)
        {
          if (y > 0)
            next.emplace_back(i, y - 1, 0);
        }
        else if (grid[loc] == 3)
        {
          if (y > 0)
            next.emplace_back(i, y - 1, 0);
          if (y < HEIGHT - 1)
            next.emplace_back(i, y + 1, 2);
        }
        else
        {
          continue;
        }
        break;
      }
    }

    // add next beams to queue
    for (const Beam &b : next)
    {
      int offset = b.offset();

      if (seen[offset] == 0)
      {
        seen[offset] = 1;
      }

      q.push(b);
    }

    int index = __sync_fetch_and_add(nextIndex, 1);

    // if index is above max, don't add to cache
    if (index >= BEAM_MAX)
    {
      continue;
    }

    beamIndex[offset] = index;
    if (next.size() == 1)
    {
      beamCache[index].pop = 2;
      beamCache[index].child1 = next[0];
    }
    else if (next.size() == 2)
    {
      beamCache[index].pop = 3;
      beamCache[index].child1 = next[0];
      beamCache[index].child2 = next[1];
    }
    beamCache[index].energizedBegin = energizedBegin;
    beamCache[index].energizedEnd = energizedEnd;
  }

  int count = 0;
  for (int i = 0; i < GRID_SIZE; ++i)
  {
    if (energized[i] == 1)
    {
      ++count;
    }
  }

  return count;
}

int main()
{
  uint8_t grid[GRID_SIZE];

  // initialize grid
  int no = 0;
  for (int y = 0; y < HEIGHT; ++y)
  {
    string line;
    cin >> line;
    int offset = y * WIDTH;
    for (int x = 0; x < WIDTH; ++x)
    {
      char c = line[x];
      switch (c)
      {
      case '.':
        grid[offset + x] = 0;
        break;
      case '/':
        grid[offset + x] = 1;
        break;
      case '\\':
        grid[offset + x] = 2;
        break;
      case '|':
        grid[offset + x] = 3;
        break;
      case '-':
        grid[offset + x] = 4;
        break;
      default:
        grid[offset + x] = 0;
        break;
      };
    }
  }

  // this stores beam index for each position
  int32_t beamIndex[GRID_SIZE * 4];
  fill(beamIndex, beamIndex + (GRID_SIZE * 4), -1);

  // create entries for every possible beam
  BeamEntry beamCache[BEAM_MAX];
  fill(beamCache, beamCache + BEAM_MAX, BeamEntry());

  int *nextIndex = new int(0);

  // all the positions to scan
  Beam scanPositions[SCAN_MAX];

  // left
  for (uint16_t i = 0; i < HEIGHT; ++i)
  {
    scanPositions[i] = {0, i, 1};
  }

  // right
  for (uint16_t i = 0; i < HEIGHT; ++i)
  {
    scanPositions[HEIGHT + i] = {WIDTH - 1, i, 3};
  }

  // top
  for (uint16_t i = 0; i < WIDTH; ++i)
  {
    scanPositions[HEIGHT * 2 + i] = {i, 0, 2};
  }

  // bottom
  for (uint16_t i = 0; i < WIDTH; ++i)
  {
    scanPositions[HEIGHT * 2 + WIDTH + i] = {i, HEIGHT - 1, 0};
  }

  int max = 0;
  for (int i = 0; i < SCAN_MAX; ++i)
  {
    int count = scanFromBeam(scanPositions[i], grid, beamIndex, beamCache, nextIndex);

    if (count > max)
    {
      max = count;
    }
  }

  // free

  cout << max << endl;
}