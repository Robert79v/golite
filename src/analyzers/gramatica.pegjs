// Definición de la gramática PEG.js para tu lenguaje personalizado

{
  // Aquí definimos el manejador de errores que utilizamos para clasificar los errores según la tabla.
  function manejarError(tipo, descripcion, pos) {
    console.log(`Error tipo ${tipo}: ${descripcion} en la posición ${pos}`);
    return peg$FAILED;
  }
}

start
  = declaration*

declaration
  = variableDeclaration
  / assignment
  / ifStatement
  / expression

variableDeclaration
  = "var" _ identifier _ ":" _ type _ {
      return { type: "declaration", identifier: text(), type: type };
    }

assignment
  = identifier _ "=" _ expression {
      return { type: "assignment", identifier: text(), value: text() };
    }

ifStatement
  = "if" _ expression _ block {
      return { type: "if", condition: text(), body: block };
    }

expression
  = number
  / string
  / identifier
  / binaryOperation

binaryOperation
  = left:expression _ operator _ right:expression {
      if (left && right) {
        return { type: "binary", operator: operator, left: left, right: right };
      } else {
        return manejarError(9, "Falta de operador entre expresiones", peg$currPos);
      }
    }

block
  = "{" _ statements:statement* _ "}" {
      return statements;
    }

statement
  = declaration
  / assignment
  / ifStatement
  / expression

number
  = [0-9]+ {
      return parseInt(text(), 10);
    }

string
  = "\"" chars:[^\"]* "\"" {
      return chars.join('');
    }

identifier
  = first:[a-zA-Z_] rest:[a-zA-Z0-9_]* {
      return text();
    }

type
  = "int" { return "int"; }
  / "string" { return "string"; }
  / "bool" { return "bool"; }

_ "whitespace"
  = [ \t\n\r]*

