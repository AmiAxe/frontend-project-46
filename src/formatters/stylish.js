import _ from 'lodash';

const indent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);

const stringify = (val, depth) => {
  if (!_.isObject(val)) {
    return String(val);
  }
  const objectToArray = Object.entries(val);
  const result = objectToArray.map((elem) => {
    const [key, entry] = elem;
    return `${indent(depth)}  ${key}: ${stringify(entry, depth + 1)}`;
  });
  return `{\n${result.join('\n')}\n${indent(depth - 1)}  }`;
};

const stylish = (tree) => {
  const iter = (node, depth) => {
    const result = node.flatMap((elem) => {
      switch (elem.type) {
        case 'added':
          return `${indent(depth)}+ ${elem.key}: ${stringify(elem.value, depth + 1)}`;
        case 'deleted':
          return `${indent(depth)}- ${elem.key}: ${stringify(elem.value, depth + 1)}`;
        case 'changed':
          return [
            `${indent(depth)}- ${elem.key}: ${stringify(elem.value1, depth + 1)}`,
            `${indent(depth)}+ ${elem.key}: ${stringify(elem.value2, depth + 1)}`,
          ];
        case 'nested':
          return `${indent(depth)}  ${elem.key}: {\n${iter(elem.children, depth + 1).join('\n')}\n${indent(depth)}  }`;
        default:
          return `${indent(depth)}  ${elem.key}: ${stringify(elem.value, depth + 1)}`;
      }
    });
    return result;
  };
  return `{\n${iter(tree, 1).join('\n')}\n}`;
};

export default stylish;
