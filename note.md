## hot page reload
demond: Show the latest content when the source files of the page changed。
steps: The backend monitors the source files, sends a message to the frondend as soon as they changes, and then reloads the page。
problems: 
1. How could I reload the page after SyntaxError occur
  reason: The browser would not exec the js file after detecing the SyntaxError during preparsing (That's why we need eslint) 
   - Put “webscoket” in separate js file, and let the browser parse it before loading the page.

## use jsx syntax without React
1. add plugin function, parse jsx syntax, and return js code.

### plugin function
read File, transform to AST, plugins modify AST, at the end, generate new string.

## global and module type of '.d.ts'
