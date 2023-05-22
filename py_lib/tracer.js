tracer_py = `from typing import Any
from animation_builder import *
from pprint import pprint
import sys
import io
from js import get_input

new_output_data = io.StringIO()  # Мы будем сохранять вывод сюда


def is_user_code(frame):
    co = frame.f_code
    func_filename = co.co_filename

    return func_filename.endswith('script.py')


animation = Animation('script.py')


def trace_print(frame, event, arg):
    co = frame.f_code
    func_name = co.co_name
    func_line_no = frame.f_lineno
    func_filename = co.co_filename
    # print(f'> {animation.code_lines[func_line_no-1]}')
    animation.add_step(frame=frame, output=new_output_data.getvalue())
    tmp_frame = frame

    var_lst = []
    while is_user_code(tmp_frame):
        var_lst.append({
            'locals': tmp_frame.f_locals.copy(),
            'frame': tmp_frame})
        tmp_frame = tmp_frame.f_back

    # animation_frames.append(current_animation_frame)
    # print()


def trace_line(frame, event, arg):
    if not is_user_code(frame):
        return
    if event != 'line':
        return
    trace_print(frame, event, arg)
    return trace_line


def trace_call(frame, event, arg):
    if not is_user_code(frame):
        return
    if event != 'call':
        return
    trace_print(frame, event, arg)
    return trace_line


# Сохраняем оригинальные sys.stdin и sys.stdout
original_stdin = sys.stdin
original_stdout = sys.stdout

# Создаем новые потоки ввода и вывода
# Здесь может быть ваша строка для передачи в stdin
new_input_data = get_input()
sys.stdin = io.StringIO(new_input_data)

sys.stdout = new_output_data

# Получаем результат из нового sys.stdout


sys.settrace(trace_call)

import script

sys.settrace(None)

output = new_output_data.getvalue()

# Возвращаем sys.stdin и sys.stdout к оригинальным значениям
sys.stdin = original_stdin
sys.stdout = original_stdout

animation_dict = animation.to_dict(output)
pprint(animation_dict)
# print(f'<>{output}<>')
`;
