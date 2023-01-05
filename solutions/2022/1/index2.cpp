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
  long max1 = 0;
  for (int pos = 0; pos < elfCount; pos++) {
    if (calories[pos] > max1) {
      max1 = calories[pos];
    }
  }

  // scan again, ignoring max1
  long max2 = 0;
  for (int pos = 0; pos < elfCount; pos++) {
    if (calories[pos] > max2 && calories[pos] != max1) {
      max2 = calories[pos];
    }
  }

  // scan again, ignoring max1 and max2
  long max3 = 0;
  for (int pos = 0; pos < elfCount; pos++) {
    if (calories[pos] > max3 &&
        !(calories[pos] == max2 || calories[pos] == max1)) {
      max3 = calories[pos];
    }
  }

  std::cout << max1 + max2 + max3 << "\n";

  return 0;
}