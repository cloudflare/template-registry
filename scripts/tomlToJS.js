/**
 * Parses the toml files located in templates/meta_data and takes the JS in
 * 'code' field and placing it in templates/javascript
 */
const fs = require('fs')
//requiring path and fs modules
const path = require('path')
const toml = require('toml')
const TOML = require('@iarna/toml')

//joining path of directory
const DIRECTORYPATH = path.join(__dirname, 'templates/meta_data')
const JSDIRECTORYPATH = path.join(__dirname, 'templates/javascript')

const createFile = (filePath, content) => {
  // write to a new file named 2pac.txt
  fs.writeFile(filePath, content, err => {
    // throws an error, you could also catch it here
    if (err) throw err
    console.log('Content saved!')
  })
}

//read in all the toml files
fs.readdir(DIRECTORYPATH, function(err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  files.forEach(function(file) {
    const filePath = DIRECTORYPATH + '/' + file
    const jsFilePath = JSDIRECTORYPATH + '/' + file.replace('.toml', '.js')
    // Do whatever you want to do with the file
    fs.readFile(filePath, (err, data) => {
      if (err) throw err
      jsonData = toml.parse(data.toString())
      if (jsonData.code) {
        createFile(jsFilePath, jsonData.code)
      }
      delete jsonData.code
      const tomlData = TOML.stringify(jsonData)
      createFile(filePath, tomlData)
    })
  })
})
