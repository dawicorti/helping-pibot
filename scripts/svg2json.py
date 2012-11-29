import sys
import json
from xml.dom.minidom import parse

REFERENCE = {
    'x': 0.0,
    'y': 0.0,
    'height': 1.0
}

HEADER_DATA = """/*global define,document*/
/*jslint nomen: true*/

define(function (require) {
    "use strict";

    return {
        chunks: [
"""

FOOTER_DATA = """
        ]
    };

});"""

KNOWN_CHUNKS = ('staticbox', 'rigidbox', 'teleporter')


def get_reference(dom):
    for rect in dom.getElementsByTagName('rect'):
        if rect.getAttribute('id') == 'reference':
            return rect


def to_json(rect):
    json_rect = dict([
        (attr, float(rect.getAttribute(attr)))
        for attr in ('x', 'y', 'width', 'height')
    ])
    json_rect['name'] = 'staticbox'
    if rect.getAttribute('id').split('-')[0] in KNOWN_CHUNKS:
        json_rect['name'] = rect.getAttribute('id').split('-')[0]
    elif rect.getAttribute('id').split('-')[0].find('platform') != -1:
        full_def = rect.getAttribute('id').split('-')[0]
        json_rect['name'] = full_def.split('_')[0]
        json_rect['identity'] = int(full_def.split('_')[1])
        json_rect['tx'] = get_value(full_def.split('_')[2])
        json_rect['ty'] = get_value(full_def.split('_')[3])
        json_rect['velocity'] = float(full_def.split('_')[4])
    elif rect.getAttribute('id').split('-')[0].find('switch') != -1:
        full_def = rect.getAttribute('id').split('-')[0]
        json_rect['name'] = full_def.split('_')[0]
        json_rect['identity'] = int(full_def.split('_')[1])
    return json_rect


def get_value(attr):
    sign = 1
    if attr.find('m') != -1:
        attr = attr.replace('m', '')
        sign = -1
    return sign * float(attr)


def normalized_rect(ref, rect):
    ratio = REFERENCE['height'] / ref['height']
    pos_ref = {
        'x': (ref['x'] + (ref['width'] / 2.0)),
        'y': (ref['y'] + (ref['height'] / 2.0))
    }
    normalized = {
        'name': rect['name'],
        'options': {
            'height': rect['height'] * ratio,
            'width': rect['width'] * ratio
        },
        'pos': {
            'x': ((
                rect['x'] + (rect['width'] / 2.0)
            ) - pos_ref['x']) * ratio + REFERENCE['x'],
            'y': -((
                rect['y'] + (rect['height'] / 2.0)
            ) - pos_ref['y']) * ratio + REFERENCE['y']
        }
    }
    if rect['name'] == 'platform':
        normalized['options']['target'] = {
            'x': normalized['pos']['x'] + rect['tx'],
            'y': normalized['pos']['y'] + rect['ty'],
        }
        normalized['options']['identity'] = rect['identity']
        normalized['options']['velocity'] = rect['velocity']
    elif rect['name'] == 'switch':
        normalized['options']['identity'] = rect['identity']
    return normalized


def svg2json(svg_path, json_path):
    dom = parse(svg_path)
    reference = to_json(get_reference(dom))
    data = HEADER_DATA
    index = 0
    for rect in dom.getElementsByTagName('rect'):
        if index > 0:
            data += ',\n'
        data += '            '
        data += json.dumps(normalized_rect(reference, to_json(rect)))
        index += 1
    data += FOOTER_DATA
    with open(json_path, 'w')as json_output:
        json_output.write(data)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print '%s <svg input file> <json output file>'
    else:
        svg2json(sys.argv[1], sys.argv[2])
