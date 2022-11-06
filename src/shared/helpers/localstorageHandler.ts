type Items =
    | {
          name: 'save';
          value: 'true' | 'false';
      }
    | {
          name: 'history';
          value: string;
      }
    | {
          name: 'currentRoute';
          value: string;
      };

export const getItem = (name: Items['name']) => localStorage.getItem(name);
export const setItem = (item: Items) => localStorage.setItem(item.name, item.value);
export const removeItems = (names: Items['name'][]) => names.forEach((name) => localStorage.removeItem(name));
