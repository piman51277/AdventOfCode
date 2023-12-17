#include <iostream>
#include <string>
#include <vector>
#include <queue>
#include <thread>

using namespace std;
using std::cout;

// in this case, our input size is known
constexpr int WIDTH = 110;
constexpr int HEIGHT = 110;

constexpr int GRID_SIZE = WIDTH * HEIGHT;

// we know roughly 12% of the grid will be filled with non spaces.
// Allocate 15% to be safe
constexpr int MAX_MIRRORS = WIDTH * HEIGHT * 0.15;

constexpr int SCAN_MAX = (WIDTH + HEIGHT) * 2;

constexpr int THREAD_COUNT = 20;
constexpr int BLOCK_SIZE = SCAN_MAX / THREAD_COUNT;

// direction enum
//  0 = up
//  1 = right
//  2 = down
//  3 = left

struct Beam
{
  uint16_t x;
  uint16_t y;
  uint16_t dir;

  Beam(uint16_t x, uint16_t y, uint16_t dir) : x(x), y(y), dir(dir) {}

  Beam() : x(0), y(0), dir(0) {}

  int offset() const
  {
    return (y * WIDTH + x) * 4 + dir;
  }
};

struct BeamEntry
{
  int child1;
  int child2;
  int energizedTiles[WIDTH];
};

int scanFromBeam(Beam b, uint16_t *grid, uint16_t *energized, uint16_t *seen)
{
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

    vector<Beam> next;
    next.reserve(100);

    // up
    if (dir == 0)
    {
      for (int i = y; i >= 0; --i)
      {
        int loc = i * WIDTH + x;
        energized[loc] = 1;

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
        q.push(b);
      }
    }
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

void threadScan(Beam *scanPositions, uint16_t *grid, int start, int end, int *max)
{

  // a copy of the grid that stores on/off
  uint16_t energized[GRID_SIZE];

  // array that stores whether or not we've seen a certain beam
  uint16_t seen[GRID_SIZE * 4];

  for (int i = start; i < end; ++i)
  {
    fill(energized, energized + GRID_SIZE, 0);
    fill(seen, seen + GRID_SIZE * 4, 0);
    int count = scanFromBeam(scanPositions[i], grid, energized, seen);
    if (count > *max)
    {
      *max = count;
    }
  }
}

int main()
{
  uint16_t grid[GRID_SIZE];

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
        no++;
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

  // create an array of max values
  int max[THREAD_COUNT];
  fill(max, max + THREAD_COUNT, 0);

  // create an array of threads
  thread threads[THREAD_COUNT];

  // start the threads
  for (int i = 0; i < THREAD_COUNT; ++i)
  {
    threads[i] = thread(threadScan, scanPositions, grid, i * BLOCK_SIZE, (i + 1) * BLOCK_SIZE, &max[i]);
  }

  // join the threads
  for (int i = 0; i < THREAD_COUNT; ++i)
  {
    threads[i].join();
  }

  // find the max
  int maxV = 0;
  for (int i = 0; i < THREAD_COUNT; ++i)
  {
    if (max[i] > maxV)
    {
      maxV = max[i];
    }
  }

  cout << maxV << endl;
}