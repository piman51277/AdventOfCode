# Part 2 manual input tables

There are 2 manual input tables:
- `faceDefinitions`, which defines regions of the input as a face
- `warpInstructions`, which defines how each face is connected

## faceDefinitions
This is fairly straightforward. x and y are the ranges that define the face, inclusive. However, make sure these definition ids match up with your physical model (if you have one), as these ids are used to define the warp instructions.

## warpInstructions
Each line represents how one face interacts with another. In total, there should be 16 instructions. 


Each entry is in this format: `<starting face> <start orientation> <ending face> <end orientation>`
- `starting face` is the face that is being warped from 
- `start orientation` is the orientation of the player when they are about to warp
- `ending face` is the face that is being warped to
- `end orientation` is the orientation of the player after they warp

For example, for the following map:
| . | 0 | 1 |
| - | - | - |
| . | 2 | . |
| 3 | 4 | . |
| 5 | . | . |

The warp instructions for the `0` face would be:
```
0 up 5 right
0 right 1 right
0 down 2 down
0 left 3 right
```

> WARNING: All orientation values are relative to the flat cube map. 