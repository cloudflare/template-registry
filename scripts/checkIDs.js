/**
 * Parses the toml files located in templates/meta_data and takes the JS in
 * 'code' field and placing it in templates/javascript
 */
const fs = require('fs')
//requiring path and fs modules
const path = require('path')
const toml = require('toml')
var process = require('process')
// process.chdir('../')

//joining path of directory
const DIRECTORYPATH = path.join(__dirname, '/../templates/meta_data')
const JSDIRECTORYPATH = path.join(__dirname, '/../templates/javascript')

//read in all the toml files
fs.readdir(DIRECTORYPATH, function(err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  files.forEach(function(file) {
    const filePath = DIRECTORYPATH + '/' + file
    const jsFilePath = JSDIRECTORYPATH + '/' + file.replace('.toml', '.js')
    const fileID = file.replace('.toml', '')
    // console.log('fileID', fileID)
    // Do whatever you want to do with the file
    fs.readFile(filePath, (err, data) => {
      if (err) throw err
      jsonData = toml.parse(data.toString())
      const id = jsonData.id
      if (id != fileID) {
        console.log("ID doesn't match toml fileName", id, fileID)
      }
      if (jsonData.type === 'snippet') {
        //try to read the javascript file
        fs.readFile(jsFilePath, (err, javascriptData) => {
          if (err) throw err
          if (!javascriptData.toString()) {
            console.log('JS file doesnt exist for snippet ' + id)
          }
          // console.log('javascriptData', javascriptData.toString())
        })
      }
    })
  })
})
