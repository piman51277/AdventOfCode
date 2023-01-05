#include <bits/stdc++.h>
#include <iostream>
#include <vector>

int main() {
  freopen("input.txt", "r", stdin);

  int elfCount = 255;
  std::vector<long> calories(elfCount);

  for (int elf = 0; elf < elfCount; elf++) {
    int calorieTotal = 0;
    while (true) {
      int foodValue;
      std::cin >> foodValue;
      calorieTotal += foodValue;

      if (foodValue == 0) {
        break;
      }
    }
    calories[elf] = calorieTotal;
  }

  // find max of calories
  long max = 0;
  for (int pos = 0; pos < elfCount; pos++) {
    if (calories[pos] > max) {
      max = calories[pos];
    }
  }

  std::cout << max << "\n";

  return 0;
}