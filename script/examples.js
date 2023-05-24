python_example_code = `
class Node:
    
    def __init__(self):
        self.neighs = []

        
n, m = map(int, input().split())
graph = [Node() for _ in range(n)]
for i in range(m):
    v, u = map(int, input().split())
    graph[v].neighs.append(u)

print(graph)
`;

function set_code(code) {
  editor.setValue(code);
}
