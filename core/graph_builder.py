from pyvis.network import Network
from .state import get_global
    
def make_graph(ob, _nodes, _edges):

    if id(ob) in _nodes:
        return {ob}

    if type(ob) is list:
        ret = set()
        for value in ob:
            ret = ret.union(make_graph(value, _nodes, _edges))
        return ret

    _nodes.add(id(ob))
    if hasattr(ob, '__dict__'):
        for name_attr, value_attr in ob.__dict__.items():
            con = make_graph(value_attr, _nodes, _edges)
            for node in con:
                _edges.add((id(ob), id(node)))
                _edges.add((id(node), id(ob)))
    return {ob}


def get_label(_id, dct):
    for name, value in dct.items():
        if id(value) == _id:
            return name
        if type(value) is list or type(value) is tuple:
            for num, tv in enumerate(value):
                if id(tv) == _id:
                    return f'{name}[{num}]'
    return str(_id)


def show_graph(_nodes, _edges, naming, filename):
    net = Network(notebook=True)
    for node in _nodes:
        net.add_node(node, label=get_label(node, naming))
#     net.add_nodes(list(_nodes), label=list(map(str, _nodes)))
    net.add_edges(_edges)
    net.show(filename)
    
def save_network_state(obj, filename):
    _nodes = set()
    _edges = set()
    make_graph(obj, _nodes, _edges)
    show_graph(_nodes, _edges, get_global(), filename)
