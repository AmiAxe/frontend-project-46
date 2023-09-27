import _ from 'lodash';

const stringify = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }
  if (_.isString(data)) {
    return `'${data}'`;
  }
  return String(data);
};

const plain = (tree) => {
  const iter = (node, path) => {
    const result = node.flatMap((elem) => {
      switch (elem.type) {
        case 'added':
          return `Property '${path}${elem.key}' was added with value: ${stringify(elem.value)}`;
        case 'deleted':
          return `Property '${path}${elem.key}' was removed`;
        case 'changed':
          return `Property '${path}${elem.key}' was updated. From ${stringify(elem.value1)} to ${stringify(elem.value2)}`;
        case 'nested':
          return iter(elem.children, `${path}${elem.key}.`);
        case 'unchanged':
          return [];
        default:
          return [];
      }
    });
    return result.join('\n');
  };
  return iter(tree, '');
};

export default plain;
