// Part 2 but CUDA and its a complete brute force search
// this took ~800ms... this is insane

#include <iostream>
#include <string>
#include <fstream>
#include <vector>

using namespace std;

__global__ void findSeedLocKernel(int64_t seedStart, int64_t range, int64_t **maps, int *maplengths, int64_t *outArr)
{
  int index = blockIdx.x * blockDim.x + threadIdx.x;
  int stride = blockDim.x * gridDim.x;

  int64_t minLocFound = INT64_MAX;
  for (int64_t i = seedStart + index; i < range + seedStart; i += stride)
  {
    int64_t loc = i;
    for (int j = 0; j < 7; j++)
    {
      for (int k = 0; k < maplengths[j]; k++)
      {
        int64_t to = maps[j][k * 3];
        int64_t from = maps[j][k * 3 + 1];
        int64_t range = maps[j][k * 3 + 2];

        if (loc >= from && loc <= from + range - 1)
        {
          loc = to + (loc - from);
          break;
        }
      }
    }

    if (loc < minLocFound)
    {
      minLocFound = loc;
    }
  }

  if (minLocFound < INT64_MAX)
    outArr[index] = minLocFound;
}

int main()
{
  ifstream infile("inputeasy.txt");

  int numSeedPairs;
  infile >> numSeedPairs;

  vector<pair<int64_t, int64_t>> seedPairs;
  for (int i = 0; i < numSeedPairs; i++)
  {
    int64_t x, y;
    infile >> x >> y;
    seedPairs.push_back(make_pair(x, y));
  }

  int numMaps = 7;
  int *mapLengths;
  cudaMallocManaged(&mapLengths, numMaps * sizeof(int));

  // create an array of arrays in cuda memory
  int64_t **maps;
  cudaMallocManaged(&maps, numMaps * sizeof(int64_t *));

  infile >> numMaps;

  for (int i = 0; i < numMaps; i++)
  {
    int mapLength;
    infile >> mapLength;
    mapLengths[i] = mapLength;

    int64_t *map;
    cudaMallocManaged(&map, mapLength * sizeof(int64_t) * 3);
    for (int j = 0; j < mapLength; j++)
    {
      // maps come in a triplet

      infile >> map[j * 3];
      infile >> map[j * 3 + 1];
      infile >> map[j * 3 + 2];
    }
    maps[i] = map;
  }

  int64_t totMin = INT64_MAX;
  for (auto seedPair : seedPairs)
  {
    int64_t seedStart = seedPair.first;
    int64_t seedEnd = seedPair.second;

    int64_t range = seedEnd - seedStart + 1;

    int blockSize = 512;
    int numBlocks = 200;

    int64_t *outArr;
    // each thread will write to a different index in the outArr
    cudaMallocManaged(&outArr, blockSize * numBlocks * sizeof(int64_t));

    findSeedLocKernel<<<numBlocks, blockSize>>>(seedStart, range, maps, mapLengths, outArr);
    cudaDeviceSynchronize();

    // find the min of the outArr
    int64_t minLocFound = INT64_MAX;
    for (int i = 0; i < blockSize * numBlocks; i++)
    {
      if (outArr[i] < minLocFound && outArr[i] != 0)
      {
        minLocFound = outArr[i];
      }
    }

    if (minLocFound < totMin)
    {
      totMin = minLocFound;
    }

    // free the memory
    cudaFree(outArr);
  }

  // free the memory
  for (int i = 0; i < numMaps; i++)
  {
    cudaFree(maps[i]);
  }

  cudaFree(maps);
  cudaFree(mapLengths);

  cout << totMin << endl;
}