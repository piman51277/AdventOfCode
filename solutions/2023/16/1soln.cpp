#include <iostream>
#include <string>
#include <vector>
#include <queue>
using namespace std;
using std::cout;

// in this case, our input size is known
constexpr int WIDTH = 220;
constexpr int HEIGHT = 220;

constexpr int GRID_SIZE = WIDTH * HEIGHT;

// we know roughly 12% of the grid will be filled with non spaces.
// Allocate 15% to be safe
constexpr int MAX_MIRRORS = WIDTH * HEIGHT * 0.15;

// direction enum
//  0 = up
//  1 = right
//  2 = down
//  3 = left

struct Beam
{
  uint8_t x;
  uint8_t y;
  uint8_t dir;

  Beam(uint8_t x, uint8_t y, uint8_t dir) : x(x), y(y), dir(dir) {}

  int offset() const
  {
    return (y * WIDTH + x) * 4 + dir;
  }
};

int main()
{
  uint8_t grid[GRID_SIZE];

  // initialize grid
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

  // a copy of the grid that stores on/off
  uint8_t energized[GRID_SIZE];
  fill(energized, energized + GRID_SIZE, 0);

  // array that stores whether or not we've seen a certain beam
  uint8_t seen[GRID_SIZE * 4];
  fill(seen, seen + GRID_SIZE * 4, 0);

  // queue of beams to process
  queue<Beam> q;
  q.emplace(0, 0, 1);

  while (q.size() > 0)
  {
    const Beam &b = q.front();
    q.pop();

    const uint8_t &x = b.x;
    const uint8_t &y = b.y;
    const uint8_t &dir = b.dir;

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
      // check if inbounds
      if (b.x < 0 || b.x >= WIDTH || b.y < 0 || b.y >= HEIGHT)
      {
        continue;
      }

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

  cout << count << endl;
}