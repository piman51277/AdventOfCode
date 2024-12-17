import z3
seq = [2, 4, 1, 1, 7, 5, 0, 3, 4, 7, 1, 6, 5, 5, 3, 0]
arguments = []
a = z3.BitVec('a', 64)
for i in range(16):
    bx = z3.BitVecVal(1, 64) ^ ((a >> 3*i) % 8)
    cx = (a >> 3*i) >> bx
    arguments.append((((bx) ^ (cx)) ^ 6) % 8 == seq[i])
arguments.append(a < 2**48)
s = z3.Solver()
s.add(arguments)
s.check()
print(s.model())
