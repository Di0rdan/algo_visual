animation_builder_py = `from typing import Any
import sys

def get_repr(value):
    return value.__class__.__name__[:8]

def get_trace_attrs(value):
    # print(f'trying to get attrs of: {type(value)}')
    if type(value) is int:
        return {}
    elif type(value) is float:
        return {}
    elif type(value) is str:
        return {}
    elif type(value) is type:
        return {}
    elif type(value) in [list, tuple]:
        return {
            f'[{str(i)}]': value[i]
            for i in range(len(value))
        } 
    elif type(value) is dict:
        return {
            f'[{get_repr(key)}]': value[key]
            for key in value
        } 
    else:
        return {
            attr_name: value.__getattribute__(attr_name)
            for attr_name in
            list(filter(lambda attr_name: 
                           not callable(value.__getattribute__(attr_name)) and
                           not attr_name.startswith('__') and 
                           not attr_name.endswith('__') and
                           not (type(value.__getattribute__(attr_name)) is type), 
                           value.__dir__()))}


class AnimationFrame:

    class Variable:

        def __init__(self, value):
            self.value = value
            self.linked_vars = {}
            self.repr = None
            self.blink = False

        def to_dict(self):
            return {
                'repr': get_repr(self.value),
                'vars': self.linked_vars
            }

    def __init__(self, code_line, output):
        self.frames = {} # {id: {call_func: str, vars: dict}}
        self.frames_order = [] # [id1, id2, ...]
        self.code_line = code_line
        self.output=output

        self.id_to_var = {} #{id: Variable}

    def add_var(self, value):
        if id(value) in self.id_to_var:
            return
        self.id_to_var[id(value)] = self.Variable(value)

        for attr_name, var in get_trace_attrs(value).items():
            self.add_var(var)
            self.id_to_var[id(value)].linked_vars[attr_name] = id(var)
                

    def add_frame(self, frame, code_line):
        self.frames_order = [id(frame)] + self.frames_order
        vars_dict = {}
        for name, value in frame.f_locals.items():
            if not name.startswith('__') and \
                not name.endswith('__') and \
                not name.startswith('.') and \
                not callable(value) and \
                not type(value) is type:
                vars_dict[name] = id(value)
                self.add_var(value)
        self.frames[id(frame)] = {
            'vars': vars_dict,
            'call_func': frame.f_code.co_name,
            'code_line': code_line,
            'line_num': frame.f_lineno,
        }

    def to_dict(self):
        res = {}
        res['code_frames'] = [
            {
                'id': id_,
                'call_func': self.frames[id_]['call_func'],
                'code_line': self.frames[id_]['code_line'],
                'line_num': self.frames[id_]['line_num'],
                'vars': self.frames[id_]['vars'],
            } for id_ in self.frames_order
        ]
        res['vars'] = {
            id_: var.to_dict()
            for id_, var in self.id_to_var.items()
        }
        res['output'] = self.output
        return res


class Animation:

    def __init__(self, script_file_name):
        self.animation_frames = []
        self.code_lines = []
        with open(script_file_name, 'r') as f:
            source = f.read()
            # print(source)
            self.code_lines = source.split('''\n''')
        self.script_file_name = script_file_name

    def is_user_code(self, frame):
        co = frame.f_code
        func_filename = co.co_filename

        return func_filename.endswith(self.script_file_name)

    def add_step(self, frame, output):
        cur_animation_frame = AnimationFrame(
            code_line=self.code_lines[frame.f_lineno-1],
            output=output)
        
        while self.is_user_code(frame):

            func_line_no = frame.f_lineno

            cur_animation_frame.add_frame(frame, self.code_lines[func_line_no-1])
            frame = frame.f_back
        
        self.animation_frames.append(cur_animation_frame)

    def to_dict(self, output):
        res = {}
        res['code'] = self.code_lines
        res['frames'] = []
        for anim_frame in self.animation_frames:
            dct = anim_frame.to_dict()
            if len(res['frames']) == 0 or dct != res['frames'][-1]:
                res['frames'].append(dct)
        #res['frames'].append({
        #    'code_frames': [],
        #    'output': output,
        #    'vars': {},
        #})
        return res
`;
