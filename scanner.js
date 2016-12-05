var fs = require('fs');

var tabSize = 5;

var keywords = [
    "TABLE",
    "PRIMARY",
    "KEY",
    "NULL",
    "CREATE",
    "DROP",
    "ALTER",
    "ADD",
    "SELECT",
    "WHERE",
    "REAL",
    "INTEGER",
    "STRING",
    "DATETIME",
    "VARCHAR",
    "FROM",
    "AND",
    "OR"
];

var patterns = {
    name: /[A-Za-z]\w+/,
    float: /[-+]?(\d*[.])\d+/,
    integer: /[0-9]+/,
    newline: /\n/,
    whitespace: /[ \t]+/,
    operators: /[<>=]/,
    specials: /[,\.'();]/,
    junk: /[\S]+/
};

var symbols = {
    lcb: "(",
    rcb: ")",
    eos: ";",
    comma: ",",
    dot: ".",
    ap: "\'"
};

function token(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
}

function parse(text) {
    var combine = /[A-Za-z]\w+|[-+]?(\d*[.])?\d+|[0-9]+|[\n]|[ \t]+|[<>=]|[,\.'();]|[\S]/g;
    var matches = text.match(combine);

    return matches;
}

function tokenize(lexems) {
    var tokens = [];
    var lineNumber = 1;
    var currentPosition = 1;

    for (var i = 0; i < lexems.length; i++) {
        var lexeme = lexems[i];
        if (patterns.name.test(lexeme)) {
            if (keywords.filter(function(keyword) {
                    return keyword == lexeme;
                }).length > 0)
                tokens.push(new token("keyword", lexeme, lineNumber, currentPosition));
            else {
                tokens.push(new token("name", lexeme, lineNumber, currentPosition));
            }
            currentPosition += lexeme.length;
        } else if (patterns.float.test(lexeme)) {
            tokens.push(new token("float", lexeme, lineNumber, currentPosition));
            currentPosition += lexeme.length;
        } else if (patterns.integer.test(lexeme)) {
            tokens.push(new token("int", lexeme, lineNumber, currentPosition));
            currentPosition += lexeme.length;
        } else if (patterns.newline.test(lexeme)) {
            lineNumber += 1;
            currentPosition = 0;
        } else if (patterns.whitespace.test(lexeme)) {
            if (lexeme === " ") currentPosition += 1;
            if (lexeme === "\t") currentPosition += tabSize;
        } else if (patterns.operators.test(lexeme)) {
            tokens.push(new token("op", lexeme, lineNumber, currentPosition));
            currentPosition += lexeme.length;
        } else if (patterns.specials.test(lexeme)) {
            for (var key in symbols) {
                if (symbols.hasOwnProperty(key)) {
                    if (lexeme == symbols[key]) {
                        tokens.push(new token(key, symbols[key], lineNumber, currentPosition));
                    }
                }
            }
            currentPosition += lexeme.length;
        } else {
            throw new Error("Invalid character \"" + lexeme + "\" at " + lineNumber + ":" + currentPosition);
        }
    }

    return tokens;
}

this.scan = function(filename) {
    var contents = fs.readFileSync(filename, 'utf8');
    var tokens = tokenize(parse(contents));

    console.log(tokens);
};
