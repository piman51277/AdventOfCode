import z3

s = z3.Solver()


# Variables
# x = z3.Int('x')

# Constraints
# s.add(x > 0)

# check if the constraints are satisfiable
print(s.check())
# get the model
print(s.model())
