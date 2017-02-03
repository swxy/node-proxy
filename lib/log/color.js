/**
 * console color, refer: [colors](https://github.com/Marak/colors.js)
 */

module.exports = {
    //styles
    'bold'      : (msg) => {return `\x1B[1m ${msg} \x1B[22m`},
    'italic'    : (msg) => {return `\x1B[3m ${msg} \x1B[23m`},
    'underline' : (msg) => {return `\x1B[4m ${msg} \x1B[24m`},
    'inverse'   : (msg) => {return `\x1B[7m ${msg} \x1B[27m`},
    'strikethrough' : (msg) => {return `\x1B[9m ${msg} \x1B[29m`},
    //text colors
    //grayscale
    'white'     : (msg) => {return `\x1B[37m ${msg} \x1B[39m`},
    'grey'      : (msg) => {return `\x1B[90m ${msg} \x1B[39m`},
    'black'     : (msg) => {return `\x1B[30m ${msg} \x1B[39m`},
    //colors
    'blue'      : (msg) => {return `\x1B[34m ${msg} \x1B[39m`},
    'cyan'      : (msg) => {return `\x1B[36m ${msg} \x1B[39m`},
    'green'     : (msg) => {return `\x1B[32m ${msg} \x1B[39m`},
    'magenta'   : (msg) => {return `\x1B[35m ${msg} \x1B[39m`},
    'red'       : (msg) => {return `\x1B[31m ${msg} \x1B[39m`},
    'yellow'    : (msg) => {return `\x1B[33m ${msg} \x1B[39m`},
    //background colors
    //grayscale
    'whiteBG'     : (msg) => {return `\x1B[47m ${msg} \x1B[49m`},
    'greyBG'      : (msg) => {return `\x1B[49;5;8m ${msg} \x1B[49m`},
    'blackBG'     : (msg) => {return `\x1B[40m ${msg} \x1B[49m`},
    //colors
    'blueBG'      : (msg) => {return `\x1B[44m ${msg} \x1B[49m`},
    'cyanBG'      : (msg) => {return `\x1B[46m ${msg} \x1B[49m`},
    'greenBG'     : (msg) => {return `\x1B[42m ${msg} \x1B[49m`},
    'magentaBG'   : (msg) => {return `\x1B[45m ${msg} \x1B[49m`},
    'redBG'       : (msg) => {return `\x1B[41m ${msg} \x1B[49m`},
    'yellowBG'    : (msg) => {return `\x1B[43m ${msg} \x1B[49m`}
};