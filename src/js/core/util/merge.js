function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default function merge(target, ...objs) {
  if (!objs.length) return target;
  const next = objs.shift();

  if (isObject(target) && isObject(next)) {
    Object.keys(next)
      .forEach((key) => {
        if (isObject(next[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          merge(target[key], next[key]);
        } else {
          Object.assign(target, {
            [key]: next[key],
          });
        }
      });
  }

  return merge(target, ...objs);
}
