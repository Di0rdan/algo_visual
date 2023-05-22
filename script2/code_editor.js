function highlight_code_line(line_num) {
  const from = { line: line_num - 1, ch: 0 };
  const to = { line: line_num - 1 };
  let highlightedLine = editor.markText(from, to, { className: "highlighted" });
  return highlightedLine;
}

python_example_code = `a = [1, 2, 3]
b = {1, 2, 3}
c = {'a': a, 'b': b, '1': 1}
d = (1, 2, 3)
`;

function set_code(code) {
  editor.setValue(code);
}

const textArea = document.getElementById("code");
var editor = null;
