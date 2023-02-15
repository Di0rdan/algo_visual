def get_global():
    import inspect
    frame = inspect.currentframe()
    while frame.f_globals['__name__'] != '__main__':
        frame = frame.f_back
    _f_globals = frame.f_globals.copy()
    types = [list, dict, int, float]
    reserved = ['In', 'Out']
    for name, value in _f_globals.items():
        if not name.startswith('_'):
            if type(value) is type:
                types.append(value)

    _f_globals = {
        name: value for name, value in _f_globals.items() if type(value) in types and not name.startswith('_') and name not in reserved
    }
    
    return _f_globals