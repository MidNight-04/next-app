const stringToColor = string => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const stringAvatar = name => {
  const splitName = name.split(' ');
  const firstLetter = splitName[0]?.[0]?.toUpperCase() ?? '';
  const secondLetter = splitName[1] ? splitName[1][0].toUpperCase() : '';
  return {
    sx: {
      height: '24px',
      width: '24px',
      fontSize: '1rem',
      bgcolor: stringToColor(firstLetter + secondLetter),
    },
    children: `${firstLetter}${secondLetter}`,
  };
};
export { stringAvatar, stringToColor };
