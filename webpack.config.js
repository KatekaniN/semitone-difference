const path = require('path');

module.exports = {
  entry: './src/jam_buddy_gui.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: "development"
};