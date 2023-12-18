#include <iostream>
#include <string>
#include <vector>
#include <deque>
#include <fstream>
using namespace std;
using std::cout;

// in this case, our input size is known
constexpr int WIDTH = 110;
constexpr int HEIGHT = 110;

constexpr int GRID_SIZE = WIDTH * HEIGHT;

constexpr int SCAN_MAX = (WIDTH + HEIGHT) * 2;

// tune this to get the best performance (lower is faster)
constexpr int BEAM_MAX = (float)GRID_SIZE * 0.05 * 4 + SCAN_MAX;

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
};

struct BeamEntry
{
  Beam child1;
  Beam child2;
  int32_t energizedEnd;

  BeamEntry() : child1(0, 0, 0), child2(0, 0, 0), energizedEnd(-1) {}
};

int scanFromBeam(Beam b, uint8_t *grid, uint8_t *energized, uint8_t *seen, int32_t *beamIndex, BeamEntry *beamCache, int32_t *nextIndex)
{
  // queue of beams to process
  deque<Beam> q;
  q.push_back(b);

  while (q.size() > 0)
  {
    const Beam &b = q.front();
    q.pop_front();

    const uint16_t &x = b.x;
    const uint16_t &y = b.y;
    const uint8_t &dir = b.dir;

    // cache hit
    uint32_t sOffset = y * WIDTH + x;
    uint32_t offset = (sOffset) * 4 + dir;
    int32_t cIndex = beamIndex[offset];
    if (cIndex != -1)
    {

      const BeamEntry &be = beamCache[cIndex];

      // add children
      Beam c1 = be.child1;
      Beam c2 = be.child2;

      if (c1.dir != 5)
      {
        uint32_t c1SOffset = c1.y * WIDTH + c1.x;
        if (!(seen[c1SOffset] & (1 << c1.dir)))
        {
          seen[c1SOffset] |= (1 << c1.dir);
          q.push_back(c1);
        }
      }

      if (c2.dir != 5)
      {
        uint32_t c2SOffset = c2.y * WIDTH + c2.x;
        if (!(seen[c2SOffset] & (1 << c2.dir)))
        {
          seen[c2SOffset] |= (1 << c2.dir);
          q.push_back(c2);
        }
      }

      // add energized
      int32_t eBegin = sOffset;
      int32_t eEnd = be.energizedEnd;

      switch (dir)
      {
      case 0:
        for (int32_t i = eEnd; i <= eBegin; i += WIDTH)
        {
          energized[i] = 1;
        }
        break;
      case 1:
        for (int32_t i = eBegin; i <= eEnd; i++)
        {
          energized[i] = 1;
        }
        break;
      case 2:
        for (int32_t i = eBegin; i <= eEnd; i += WIDTH)
        {
          energized[i] = 1;
        }
        break;
      case 3:
        for (int32_t i = eEnd; i <= eBegin; i++)
        {
          energized[i] = 1;
        }
        break;
      }

      continue;
    }
    Beam nextFirst = {0, 0, 5}; // no direction 5 exists
    Beam nextSecond = {0, 0, 5};

    uint32_t energizedEnd = sOffset;

    // up
    if (dir == 0)
    {
      for (int16_t i = y; i >= 0; --i)
      {
        int loc = i * WIDTH + x;
        energized[loc] = 1;
        energizedEnd = loc;
        switch (grid[loc])
        {
        case 1:
          if (x < WIDTH - 1)
            nextFirst = {x + 1, i, 1};
          break;
        case 2:
          if (x > 0)
            nextFirst = {x - 1, i, 3};
          break;
        case 4:
          if (x < WIDTH - 1)
            nextFirst = {x + 1, i, 1};
          if (x > 0)
            nextSecond = {x - 1, i, 3};
          break;
        default:
          continue;
          break;
        }
        break;
      }
    }

    // down
    else if (dir == 2)
    {
      for (uint16_t i = y; i < HEIGHT; ++i)
      {
        int loc = i * WIDTH + x;
        energized[loc] = 1;
        energizedEnd = loc;
        switch (grid[loc])
        {
        case 1:
          if (x > 0)
            nextFirst = {x - 1, i, 3};
          break;
        case 2:
          if (x < WIDTH - 1)
            nextFirst = {x + 1, i, 1};
          break;
        case 4:
          if (x > 0)
            nextFirst = {x - 1, i, 3};
          if (x < WIDTH - 1)
            nextSecond = {x + 1, i, 1};
          break;
        default:
          continue;
          break;
        }
        break;
      }
    }

    // right
    else if (dir == 1)
    {
      for (uint16_t i = x; i < WIDTH; ++i)
      {
        int loc = y * WIDTH + i;
        energized[loc] = 1;
        energizedEnd = loc;
        switch (grid[loc])
        {
        case 1:
          if (y > 0)
            nextFirst = {i, y - 1, 0};
          break;
        case 2:
          if (y < HEIGHT - 1)
            nextFirst = {i, y + 1, 2};
          break;
        case 3:
          if (y > 0)
            nextFirst = {i, y - 1, 0};
          if (y < HEIGHT - 1)
            nextSecond = {i, y + 1, 2};
          break;
        default:
          continue;
          break;
        }
        break;
      }
    }

    // left
    else
    {
      for (int16_t i = x; i >= 0; --i)
      {
        int loc = y * WIDTH + i;
        energized[loc] = 1;
        energizedEnd = loc;
        switch (grid[loc])
        {
        case 1:
          if (y < HEIGHT - 1)
            nextFirst = {i, y + 1, 2};
          break;
        case 2:
          if (y > 0)
            nextFirst = {i, y - 1, 0};
          break;
        case 3:
          if (y > 0)
            nextFirst = {i, y - 1, 0};
          if (y < HEIGHT - 1)
            nextSecond = {i, y + 1, 2};
          break;
        default:
          continue;
          break;
        }
        break;
      }
    }

    // add next beams to queue
    if (nextFirst.dir != 5)
    {
      uint32_t sOffset = nextFirst.y * WIDTH + nextFirst.x;

      if (!(seen[sOffset] & (1 << nextFirst.dir)))
      {
        seen[sOffset] |= (1 << nextFirst.dir);
        q.push_back(nextFirst);
      }
    }
    if (nextSecond.dir != 5)
    {
      uint32_t sOffset = nextSecond.y * WIDTH + nextSecond.x;

      if (!(seen[sOffset] & (1 << nextSecond.dir)))
      {
        seen[sOffset] |= (1 << nextSecond.dir);
        q.push_back(nextSecond);
      }
    }

    // is there room?
    uint32_t index = (*nextIndex)++;
    if (index >= BEAM_MAX)
    {
      cout << "Ran out of space in beam cache" << endl;
      exit(1);
    }

    // add beam to cache
    BeamEntry &be = beamCache[index];
    be.child1 = nextFirst;
    be.child2 = nextSecond;
    be.energizedEnd = energizedEnd;

    // write to index
    beamIndex[offset] = index;
  }

  int count = 0;
  for (int i = 0; i < GRID_SIZE; ++i)
  {
    count += energized[i];
  }

  return count;
}

int main()
{

  uint8_t grid[GRID_SIZE];

  // initialize grid
  ifstream infile("input.txt");

  char buffer[(WIDTH + 1) * HEIGHT];
  infile.read(buffer, (WIDTH + 1) * HEIGHT);

  int fileInd = 0;
  int gridInd = 0;
  for (int y = 0; y < HEIGHT; ++y)
  {
    int offset = y * WIDTH;
    for (int x = 0; x < WIDTH; ++x)
    {
      char c = buffer[fileInd++];
      switch (c)
      {
      case '.':
        grid[gridInd++] = 0;
        break;
      case '/':
        grid[gridInd++] = 1;
        break;
      case '\\':
        grid[gridInd++] = 2;
        break;
      case '|':
        grid[gridInd++] = 3;
        break;
      case '-':
        grid[gridInd++] = 4;
        break;
      default:
        grid[gridInd++] = 0;
        break;
      };
    }
    ++fileInd;
  }

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

  // beam index for each position
  // we use heap because this gets very large
  int32_t *beamIndex = new int32_t[GRID_SIZE * 4];
  fill(beamIndex, beamIndex + GRID_SIZE * 4, -1);

  // the cache of beams
  BeamEntry *beams = new BeamEntry[BEAM_MAX];
  fill(beams, beams + BEAM_MAX, BeamEntry());

  // the next available index
  int32_t *nextIndex = new int32_t(0);

  // find the max
  uint8_t energized[GRID_SIZE];
  uint8_t seen[GRID_SIZE];

  int maxV = 0;
  for (int i = 0; i < SCAN_MAX; ++i)
  {
    fill(energized, energized + GRID_SIZE, 0);
    fill(seen, seen + GRID_SIZE, 0);

    int count = scanFromBeam(scanPositions[i], grid, energized, seen, beamIndex, beams, nextIndex);
    if (count > maxV)
    {
      maxV = count;
    }
  }

  cout << maxV << endl;
}