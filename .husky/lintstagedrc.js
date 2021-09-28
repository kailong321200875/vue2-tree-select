/*
 * @Author: your name
 * @Date: 2021-09-16 11:31:54
 * @LastEditTime: 2021-09-16 16:03:04
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \dsports-emloyee-webc:\Users\asus\Desktop\element-admin\.husky\lintstagedrc.js
 */
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.vue': ['prettier --write', 'eslint --fix'],
  '*.{scss,less,styl,css,html}': ['prettier --write'],
  '*.md': ['prettier --write']
}
