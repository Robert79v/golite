"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}
// Vamos a crear una función para manejar errores sintácticos
function manejarError(tipo, pos, descripcion) {
  // Crear un objeto con el error clasificado
  const error = {
    tipoError: tipo,
    posicion: pos,
    descripcion: descripcion
  };
  // Mostrar el error en consola (o manejarlo de otra forma)
  console.error(`Error tipo ${tipo}: ${descripcion} en la posición ${pos}`);
  return error;
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { start: peg$parsestart },
      peg$startRuleFunction  = peg$parsestart,

      peg$c0 = function(stmts) {
            return stmts;
          },
      peg$c1 = ";",
      peg$c2 = peg$literalExpectation(";", false),
      peg$c3 = "var",
      peg$c4 = peg$literalExpectation("var", false),
      peg$c5 = ":",
      peg$c6 = peg$literalExpectation(":", false),
      peg$c7 = "=",
      peg$c8 = peg$literalExpectation("=", false),
      peg$c9 = function(id, type, value) {
            return { type: "VariableDeclaration", name: id, dataType: type, value: value };
          },
      peg$c10 = function(id, type) {
            return { type: "VariableDeclaration", name: id, dataType: type };
          },
      peg$c11 = "int",
      peg$c12 = peg$literalExpectation("int", false),
      peg$c13 = function() { return "int"; },
      peg$c14 = "float",
      peg$c15 = peg$literalExpectation("float", false),
      peg$c16 = function() { return "float"; },
      peg$c17 = "string",
      peg$c18 = peg$literalExpectation("string", false),
      peg$c19 = function() { return "string"; },
      peg$c20 = "bool",
      peg$c21 = peg$literalExpectation("bool", false),
      peg$c22 = function() { return "bool"; },
      peg$c23 = function(id, value) {
            return { type: "Assignment", variable: id, value: value };
          },
      peg$c24 = "print",
      peg$c25 = peg$literalExpectation("print", false),
      peg$c26 = "(",
      peg$c27 = peg$literalExpectation("(", false),
      peg$c28 = ")",
      peg$c29 = peg$literalExpectation(")", false),
      peg$c30 = function(value) {
            return { type: "PrintStatement", value: value };
          },
      peg$c31 = "if",
      peg$c32 = peg$literalExpectation("if", false),
      peg$c33 = function(condition, thenBlock, elseBlock) {
            return {
              type: "IfStatement",
              condition: condition,
              thenBlock: thenBlock,
              elseBlock: elseBlock || null
            };
          },
      peg$c34 = "else",
      peg$c35 = peg$literalExpectation("else", false),
      peg$c36 = function(elseBlock) {
            return elseBlock;
          },
      peg$c37 = "{",
      peg$c38 = peg$literalExpectation("{", false),
      peg$c39 = "}",
      peg$c40 = peg$literalExpectation("}", false),
      peg$c41 = function(stmts) {
            return { type: "Block", statements: stmts.map(s => s[0]) };
          },
      peg$c42 = "for",
      peg$c43 = peg$literalExpectation("for", false),
      peg$c44 = function(init, condition, update, loopBody) {
            return {
              type: "ForLoop",
              init: init || null,
              condition: condition || null,
              update: update || null,
              body: loopBody
            };
          },
      peg$c45 = function(condition, loopBody) {
            return {
              type: "WhileLoop",
              condition: condition,
              body: loopBody
            };
          },
      peg$c46 = function(loopBody) {
            return {
              type: "InfiniteLoop",
              body: loopBody
            };
          },
      peg$c47 = function(left, op, right) {
            return { type: "Comparison", operator: op, left: left, right: right };
          },
      peg$c48 = "+",
      peg$c49 = peg$literalExpectation("+", false),
      peg$c50 = "-",
      peg$c51 = peg$literalExpectation("-", false),
      peg$c52 = function(left, op, right) {
            return { type: "AdditionOrSubtraction", operator: op, left: left, right: right };
          },
      peg$c53 = "*",
      peg$c54 = peg$literalExpectation("*", false),
      peg$c55 = "/",
      peg$c56 = peg$literalExpectation("/", false),
      peg$c57 = function(left, op, right) {
            return { type: "MultiplicationOrDivision", operator: op, left: left, right: right };
          },
      peg$c58 = function(expr) { return expr; },
      peg$c59 = "==",
      peg$c60 = peg$literalExpectation("==", false),
      peg$c61 = "!=",
      peg$c62 = peg$literalExpectation("!=", false),
      peg$c63 = "<=",
      peg$c64 = peg$literalExpectation("<=", false),
      peg$c65 = ">=",
      peg$c66 = peg$literalExpectation(">=", false),
      peg$c67 = "<",
      peg$c68 = peg$literalExpectation("<", false),
      peg$c69 = ">",
      peg$c70 = peg$literalExpectation(">", false),
      peg$c71 = /^[0-9]/,
      peg$c72 = peg$classExpectation([["0", "9"]], false, false),
      peg$c73 = ".",
      peg$c74 = peg$literalExpectation(".", false),
      peg$c75 = function() {
            return { type: "Number", value: parseFloat(text()) };
          },
      peg$c76 = "\"",
      peg$c77 = peg$literalExpectation("\"", false),
      peg$c78 = /^[^"]/,
      peg$c79 = peg$classExpectation(["\""], true, false),
      peg$c80 = function(chars) {
            return { type: "String", value: chars.join("") };
          },
      peg$c81 = "true",
      peg$c82 = peg$literalExpectation("true", false),
      peg$c83 = function() { return { type: "Boolean", value: true }; },
      peg$c84 = "false",
      peg$c85 = peg$literalExpectation("false", false),
      peg$c86 = function() { return { type: "Boolean", value: false }; },
      peg$c87 = /^[a-zA-Z_]/,
      peg$c88 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false),
      peg$c89 = /^[a-zA-Z0-9_]/,
      peg$c90 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false),
      peg$c91 = function() {
            return text();
          },
      peg$c92 = peg$otherExpectation("whitespace"),
      peg$c93 = /^[ \t\n\r]/,
      peg$c94 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),
      peg$c95 = function() {
            return null;
          },

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  // Modificamos las funciones de análisis para manejar errores
function peg$fail(expected) {
  // Cuando hay un error, capturamos el tipo de error y la posición
  const errorDescripcion = `Se esperaba ${expected}`;
  return manejarError(5, peg$currPos, errorDescripcion); // Error tipo 5: Paréntesis desbalanceados
}

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

function peg$parseExpresion() {
  var s0;
  s0 = peg$currPos;

  // Verificando si encontramos un paréntesis abierto
  if (input.charCodeAt(peg$currPos) === 40) { // CharCode para '('
    peg$currPos++;
  } else {
    // Manejar el error si no encontramos el paréntesis de apertura
    return manejarError(5, peg$currPos, "Paréntesis de apertura esperado"); // Error tipo 5
  }

  // Continuamos el análisis de la expresión...
}

  function peg$parsestart() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parsestatements();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parsestatements();
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsestatements() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = peg$parsestatement();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 59) {
        s3 = peg$c1;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsestatement() {
    var s0;

    s0 = peg$parsevariableDeclaration();
    if (s0 === peg$FAILED) {
      s0 = peg$parseassignment();
      if (s0 === peg$FAILED) {
        s0 = peg$parseprintStatement();
        if (s0 === peg$FAILED) {
          s0 = peg$parseconditional();
          if (s0 === peg$FAILED) {
            s0 = peg$parseloop();
            if (s0 === peg$FAILED) {
              s0 = peg$parseblock();
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsevariableDeclaration() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c3) {
      s1 = peg$c3;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c4); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseidentifier();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s5 = peg$c5;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsedataType();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 61) {
                      s9 = peg$c7;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c8); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseadditive();
                        if (s11 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c9(s3, s7, s11);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c3) {
        s1 = peg$c3;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseidentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 58) {
                s5 = peg$c5;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c6); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsedataType();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c10(s3, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parsedataType() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c11) {
      s1 = peg$c11;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c12); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c13();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c14) {
        s1 = peg$c14;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c15); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c16();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c17) {
          s1 = peg$c17;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c19();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 4) === peg$c20) {
            s1 = peg$c20;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c21); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c22();
          }
          s0 = s1;
        }
      }
    }

    return s0;
  }

  function peg$parseassignment() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseidentifier();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c7;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseadditive();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c23(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseprintStatement() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 5) === peg$c24) {
      s1 = peg$c24;
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c25); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c26;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c27); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsestring();
            if (s5 === peg$FAILED) {
              s5 = peg$parseidentifier();
              if (s5 === peg$FAILED) {
                s5 = peg$parsenumber();
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s7 = peg$c28;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c29); }
                }
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c30(s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseconditional() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c31) {
      s1 = peg$c31;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c32); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c26;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c27); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecomparison();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s7 = peg$c28;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c29); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseblock();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseelseClause();
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c33(s5, s9, s11);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseelseClause() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c34) {
      s1 = peg$c34;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c35); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseblock();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c36(s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseblock() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 123) {
      s1 = peg$c37;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c38); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsestatements();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsestatements();
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s5 = peg$c39;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c40); }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c41(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseloop() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c42) {
      s1 = peg$c42;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c43); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s3 = peg$c26;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c27); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseforInit();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 59) {
                  s7 = peg$c1;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c2); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse_();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsecomparison();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parse_();
                      if (s10 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 59) {
                          s11 = peg$c1;
                          peg$currPos++;
                        } else {
                          s11 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c2); }
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parse_();
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parseassignment();
                            if (s13 === peg$FAILED) {
                              s13 = null;
                            }
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parse_();
                              if (s14 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                  s15 = peg$c28;
                                  peg$currPos++;
                                } else {
                                  s15 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c29); }
                                }
                                if (s15 !== peg$FAILED) {
                                  s16 = peg$parse_();
                                  if (s16 !== peg$FAILED) {
                                    s17 = peg$parseblock();
                                    if (s17 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c44(s5, s9, s13, s17);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c42) {
        s1 = peg$c42;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c26;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c27); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecomparison();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s7 = peg$c28;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c29); }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parseblock();
                      if (s9 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c45(s5, s9);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c42) {
          s1 = peg$c42;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c43); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s3 = peg$c26;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c27); }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s5 = peg$c28;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c29); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseblock();
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c46(s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }
    }

    return s0;
  }

  function peg$parseforInit() {
    var s0;

    s0 = peg$parseassignment();
    if (s0 === peg$FAILED) {
      s0 = peg$parsevariableDeclaration();
    }

    return s0;
  }

  function peg$parsecomparison() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseadditive();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecomparisonOperator();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseadditive();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c47(s1, s3, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseadditive();
    }

    return s0;
  }

  function peg$parseadditive() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseterm();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 43) {
          s3 = peg$c48;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c49); }
        }
        if (s3 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s3 = peg$c50;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseterm();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c52(s1, s3, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseterm();
    }

    return s0;
  }

  function peg$parseterm() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parsefactor();
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 42) {
          s3 = peg$c53;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c54); }
        }
        if (s3 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 47) {
            s3 = peg$c55;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            s5 = peg$parsefactor();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c57(s1, s3, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsefactor();
    }

    return s0;
  }

  function peg$parsefactor() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c26;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c27); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseadditive();
        if (s3 !== peg$FAILED) {
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s5 = peg$c28;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c29); }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c58(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$parsestring();
        if (s0 === peg$FAILED) {
          s0 = peg$parseboolean();
          if (s0 === peg$FAILED) {
            s0 = peg$parseidentifier();
          }
        }
      }
    }

    return s0;
  }

  function peg$parsecomparisonOperator() {
    var s0;

    if (input.substr(peg$currPos, 2) === peg$c59) {
      s0 = peg$c59;
      peg$currPos += 2;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c60); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c61) {
        s0 = peg$c61;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c62); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c63) {
          s0 = peg$c63;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c64); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c65) {
            s0 = peg$c65;
            peg$currPos += 2;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c66); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 60) {
              s0 = peg$c67;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 62) {
                s0 = peg$c69;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parsenumber() {
  var s0, s1, s2, s3, s4, s5;
  
  s0 = peg$currPos;
  s1 = [];
  if (peg$c71.test(input.charAt(peg$currPos))) {
    s2 = input.charAt(peg$currPos);
    peg$currPos++;
  } else {
    s2 = peg$FAILED;
    if (peg$silentFails === 0) { peg$fail(peg$c72); }
  }
  
  if (s2 !== peg$FAILED) {
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      if (peg$c71.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }
    }
  } else {
    s1 = peg$FAILED;
  }
  
  // Manejo de números con punto decimal
  if (s1 !== peg$FAILED) {
    s2 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 46) {
      s3 = peg$c73;
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c74); }
    }
    if (s3 !== peg$FAILED) {
      s4 = [];
      if (peg$c71.test(input.charAt(peg$currPos))) {
        s5 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }
      if (s5 !== peg$FAILED) {
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          if (peg$c71.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c72); }
          }
        }
      } else {
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s3 = [s3, s4];
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 === peg$FAILED) {
      s2 = null;
    }
    if (s2 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c75();
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
  } else {
    peg$currPos = s0;
    s0 = peg$FAILED;
  }

  return s0;
}


function peg$parsestring() {
  var s0, s1, s2, s3;

  s0 = peg$currPos;
  if (input.charCodeAt(peg$currPos) === 34) {
    s1 = peg$c76;
    peg$currPos++;
  } else {
    s1 = peg$FAILED;
    if (peg$silentFails === 0) { peg$fail(peg$c77); }
  }

  if (s1 !== peg$FAILED) {
    s2 = [];
    if (peg$c78.test(input.charAt(peg$currPos))) {
      s3 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c79); }
    }
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      if (peg$c78.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c79); }
      }
    }

    if (s2 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c76;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c77); }
      }

      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c80(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
  } else {
    peg$currPos = s0;
    s0 = peg$FAILED;
  }

  return s0;
}

  function peg$parseboolean() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c81) {
      s1 = peg$c81;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c82); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c83();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c84) {
        s1 = peg$c84;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c85); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c86();
      }
      s0 = s1;
    }

    return s0;
  }

  function peg$parseidentifier() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (peg$c87.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c88); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c89.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$c89.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c90); }
        }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c91();
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parse_() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c93.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c94); }
    }
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      if (peg$c93.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c95();
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c92); }
    }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}
// Clasificación de errores basada en el tipo de error y la tabla de errores
// sintactico.js
const errorClassification = {
  5: { type: "Sintaxis", description: "Paréntesis desbalanceados: Faltan paréntesis de cierre o apertura." },
  6: { type: "Sintaxis", description: "Llaves desbalanceados: Faltan llaves {}." },
  7: { type: "Sintaxis", description: "Expresión incompleta: La expresión espera más elementos para ser válida." },
  8: { type: "Sintaxis", description: "Palabra reservada en lugar incorrecto: Uso incorrecto de una palabra clave." },
  9: { type: "Sintaxis", description: "Falta de operador entre expresiones: Expresiones consecutivas sin un operador entre ellas." },
  10: { type: "Sintaxis", description: "Separadores innecesarios: Uso incorrecto de ; o ,." },
  11: { type: "Sintaxis", description: "Tipo de declaración incorrecto: Declaraciones de tipo incompletas o inválidas." },
};

function handleSyntaxError(error) {
  const location = error.location || {};
  const errorPosition = location.start || {};
  const line = errorPosition.line || "Desconocida";
  const column = errorPosition.column || "Desconocida";

  let errorType = 0; // Default error type
  let description = "Error sintáctico no especificado"; // Default description

  // Clasificar el error basándonos en el mensaje
  if (error.message.includes("unexpected")) {
    errorType = 5; // Error de paréntesis desbalanceados
  } else if (error.message.includes("Unexpected token")) {
    errorType = 6; // Error de llaves desbalanceadas
  } else if (error.message.includes("SyntaxError")) {
    errorType = 7; // Error de expresión incompleta
  }

  // Si se encuentra el errorType en la clasificación, usamos la descripción
  if (errorClassification[errorType]) {
    description = errorClassification[errorType].description;
  }

  return {
    error: {
      code: errorType,
      message: error.message,
      type: errorClassification[errorType]?.type || "Sintaxis",
      description: description,
      line: line,
      column: column,
    },
  };
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse: peg$parse,
  handleSyntaxError
};
