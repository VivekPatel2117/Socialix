import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

// Function to convert string to a color based on the string's hash
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

// Function to generate the avatar content (first letters of name or username)
function stringAvatar(name: string) {
  const splitName = name.split(' ');
  const initials = splitName.length > 1
    ? `${splitName[0][0]}${splitName[1][0]}`
    : `${splitName[0][0]}${splitName[0][1]}`;
  
  return {
    sx: {
      bgcolor: stringToColor(name),
      height:"inherit",width:"inherit"
    },
    children: initials,
  };
}

// Main component
export default function StringAvatar({ username, full_name }: { username: string, full_name: string }) {
  // Choose which name to use (full name or username)
  const nameToUse = full_name || username;

  return (
      <Avatar {...stringAvatar(nameToUse)} /> 
  );
}
