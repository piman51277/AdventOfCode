import z3
file = open("input.txt", "r")


hailstones = []
for line in file:
    # format is 19, 13, 30 @ -2,  1, -2
    # use regex
    line = line.strip()
    line = line.replace(" ", "")
    line = line.replace("@", ",")
    hailstones.append(list(map(int, line.split(","))))

# x y z vx vy vz

# for every triplet
for i in range(len(hailstones)):
    for j in range(len(hailstones)):
        for k in range(len(hailstones)):
            if (i == j or j == k or i == k):
                continue

            hailstone1 = hailstones[i]
            hailstone2 = hailstones[j]
            hailstone3 = hailstones[k]

            t1 = z3.Int('t1')
            t2 = z3.Int('t2')
            t3 = z3.Int('t3')
            x = z3.Int('x')
            y = z3.Int('y')
            z = z3.Int('z')
            vx = z3.Int('vx')
            vy = z3.Int('vy')
            vz = z3.Int('vz')

            s = z3.Solver()
            s.add(t1 >= 0)
            s.add(x + vx * t1 == hailstone1[0] + hailstone1[3] * t1)
            s.add(y + vy * t1 == hailstone1[1] + hailstone1[4] * t1)
            s.add(z + vz * t1 == hailstone1[2] + hailstone1[5] * t1)

            s.add(t2 >= 0)
            s.add(x + vx * t2 == hailstone2[0] + hailstone2[3] * t2)
            s.add(y + vy * t2 == hailstone2[1] + hailstone2[4] * t2)
            s.add(z + vz * t2 == hailstone2[2] + hailstone2[5] * t2)

            s.add(t3 >= 0)
            s.add(x + vx * t3 == hailstone3[0] + hailstone3[3] * t3)
            s.add(y + vy * t3 == hailstone3[1] + hailstone3[4] * t3)
            s.add(z + vz * t3 == hailstone3[2] + hailstone3[5] * t3)

            if (s.check() == z3.sat):
                model = s.model()

                # extract values
                x = model[x].as_long()
                y = model[y].as_long()
                z = model[z].as_long()
                vx = model[vx].as_long()
                vy = model[vy].as_long()
                vz = model[vz].as_long()

                # is x an integer?
                if (x != int(x) or y != int(y) or z != int(z) or vx != int(vx) or vy != int(vy) or vz != int(vz)):
                    continue

                print(s)

                print(x + y + z)
                print(vx, vy, vz)

                exit()
