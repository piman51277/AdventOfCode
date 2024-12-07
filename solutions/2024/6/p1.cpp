#include <iostream>
#include <cinttypes>
#include <vector>
#include <chrono>
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>

struct fileContents
{
    uint8_t *file;
    int64_t size;
};

fileContents *loadFile(const char *filename)
{
    int fd = open(filename, O_RDONLY);
    if (fd == -1)
    {
        return nullptr;
    }

    struct stat sb;
    if (fstat(fd, &sb) == -1)
    {
        return nullptr;
    }

    uint8_t *file = (uint8_t *)mmap(NULL, sb.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
    if (file == MAP_FAILED)
    {
        return nullptr;
    }

    fileContents *contents = new fileContents();
    contents->file = file;
    contents->size = sb.st_size;

    // go ahead and preloaded the file
    for (int i = 0; i < sb.st_size; i++)
    {
        file[i] = file[i];
    }

    return contents;
}

typedef std::chrono::high_resolution_clock Clock;

int main()
{

    fileContents *contents = loadFile("input.txt");

    int rows = 130; // 8000;
    int cols = 130; // 8000;
    uint8_t *grid = (uint8_t *)malloc(rows * cols * sizeof(uint8_t));

    // input parsing
    int startingRow = -1;
    int startingCol = -1;

    auto t_parsing1 = Clock::now();

    int ptr = 0;
    for (int i = 0; i < contents->size; i++)
    {
        if (i % (cols + 1) == 0)
        {
            continue; // skip newlines
        }
        else if (contents->file[i] == '^')
        {
            grid[ptr] = '.';
            startingRow = ptr / cols;
            startingCol = ptr % cols;
        }
        else
        {
            grid[ptr] = contents->file[i];
        }
        ptr++;
    }

    auto t_parsing2 = Clock::now();

    std::vector<std::vector<uint8_t>> visitedGrid(rows, std::vector<uint8_t>(cols, 0));
    // std::vector<std::pair<int, int>> candidateSpots;
    int p1Size = 0;

    auto t_p1 = Clock::now();

    // start traversing the grid the first time to figure out all the candidate spots
    {
        int cRow = startingRow;
        int cCol = startingCol;
        int direction = 0; // 0: up, 1: right, 2: down, 3: left

        while (true)
        {
            visitedGrid[cRow][cCol] = 1;

            // move up
            if (direction == 0)
            {
                while (cRow > 0 && grid[(cRow - 1) * cols + cCol] == '.')
                {
                    cRow--;
                    visitedGrid[cRow][cCol] = 1;
                }

                if (cRow == 0)
                {
                    break;
                }

                direction = 1;
            }

            else if (direction == 1)
            {
                while (cCol < cols - 1 && grid[(cRow)*cols + cCol + 1] == '.')
                {
                    cCol++;
                    visitedGrid[cRow][cCol] = 1;
                }
                if (cCol == cols - 1)
                {
                    break;
                }

                direction = 2;
            }

            else if (direction == 2)
            {
                while (cRow < rows - 1 && grid[(cRow + 1) * cols + cCol] == '.')
                {
                    cRow++;
                    visitedGrid[cRow][cCol] = 1;
                }
                if (cRow == rows - 1)
                {
                    break;
                }

                direction = 3;
            }

            else if (direction == 3)
            {
                while (cCol > 0 && grid[(cRow)*cols + cCol - 1] == '.')
                {
                    cCol--;
                    visitedGrid[cRow][cCol] = 1;
                }
                if (cCol == 0)
                {
                    break;
                }

                direction = 0;
            }
        }

        // look for places we have visited at least once
        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < cols; j++)
            {
                if (visitedGrid[i][j] == 1)
                {
                    // candidateSpots.push_back(std::make_pair(i, j));
                    p1Size++;
                }
            }
        }

        // std::cout << "p1: " << candidateSpots.size() << std::endl;
        std::cout << "p1: " << p1Size << std::endl;
    }

    auto t_p2 = Clock::now();

    std::cout << "parsing: " << std::chrono::duration_cast<std::chrono::microseconds>(t_parsing2 - t_parsing1).count() << "us" << std::endl;
    std::cout << "p1: " << std::chrono::duration_cast<std::chrono::microseconds>(t_p2 - t_p1).count() << "us" << std::endl;
}