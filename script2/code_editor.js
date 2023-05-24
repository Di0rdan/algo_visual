function highlight_code_line(line_num) {
  const from = { line: line_num - 1, ch: 0 };
  const to = { line: line_num - 1 };
  let highlightedLine = editor.markText(from, to, { className: "highlighted" });
  return highlightedLine;
}

python_example_code = `a = []
b = a
a.append(a)
`;

function set_code(code) {
  editor.setValue(code);
}

const textArea = document.getElementById("code");
var editor = null;
