const RitaScriptVisitor = require('./lib/RitaScriptVisitor').RitaScriptVisitor;

// NEXT: integrate property handling from spectre/shared/parser.js::line 15

String.prototype.uc = function () {
  return this.toUpperCase();
}

String.prototype.ucf = function () {
  return this[0].toUpperCase() + this.substring(1);
}

class Symbol { // hrmmm?
  constructor(visitor, text) {
    this.text = text;
    this.parent = visitor;
    this.transforms = null;
  }
  getText() { return this.text; }
  accept() {
    this.text = this.parent.context[this.text] || this.text;
    return this.parent.visitTerminal(this);
  }
}

/**
 * This Visitor walks the tree generated by a parser
 */
class Visitor extends RitaScriptVisitor {

  constructor(context, lexerRules, parserRules) {
    super();
    this.lexerRules = lexerRules;
    this.parserRules = parserRules;
    this.context = context || {};
  }

  // Entry point for tree visiting
  start(ctx) {
    return this.visitScript(ctx).replace(/ +/g, ' ');
  }

  visitChildren(ctx) {
    return ctx.children.reduce((acc, child) => {
      (child.transforms = ctx.transforms);
      return acc + this.visit(child);
    }, '');
  }

  parseSymbols(s) {
    let extractParts = (match) => {
      let parts = match.split('.');
      parts.shift();
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].endsWith('()')) {
          parts[i] = parts[i].substring(0, parts[i].length - 2);
        }
      }
      return parts;
    }

    let parts, resolved, pre, pos;
    let ms = symbols.exec(s);
    while (ms) {
      parts = extractParts(ms[1])
      resolved = this.user[parts[0]];

      if (typeof resolved === 'function') {
        resolved = resolved.apply(this.user);
      }

      if (typeof resolved !== 'string') {
        throw Error(this.user.hasOwnProperty(parts[0]) ?
          'user.' + parts[0] + ' is ' + this.user[parts[0]] :
          'Parser: No User.' + parts[0] + ' property for ' + this.user.name);
      }

      for (var i = 1; i < parts.length; i++) {
        let func = resolved[parts[i]];
        if (typeof func !== 'function') {
          throw Error('Error parsing function \'' + parts[i] + '()\' in\n' + s);
        }
        resolved = resolved[parts[i]]();
      }

      pre = s.substring(0, ms.index);
      pos = s.substring(ms.index + ms[0].length);
      s = pre + resolved + pos;
      ms = symbols.exec(s);
    }

    return s;
  }

  // Visits a leaf node and returns a string
  visitTerminal(ctx) {
    let text = ctx.getText();
    //console.log('TEXT:' + text, ctx.transforms);
    if (text === '<EOF>') return ''; // ignore EOFs
    if (ctx.transforms) {
      //console.log('TRANSFORMS',ctx.transforms);
      // Note:  VERY inefficient for large runs
      for (var i = 0; i < ctx.transforms.length; i++) {
        let transform = ctx.transforms[i];
        let ttype = typeof text[transform];
        if (ttype === 'undefined') {
          throw Error('Bad transform:' + transform);
        } else if (ttype === 'function') {
          text = text[transform](); // call function
        } else {
          text = text[transform]; // get property
        }
      }
    }
    //console.log('visitTerminal', "'" + ctx.getText() + "'", ctx.transforms || '[]', '->', text);
    return text;
  }

  visitStore(ctx) {
    let text = ctx.symbol().getText();
    if (text.length && text[0] === '$') text = text.substring(1);
    this.context[text] = this.visit(ctx.expr());
    return this.context[text];
  }

  getRuleName(ctx) {
    return ctx.hasOwnProperty('symbol') ?
      this.lexerRules[ctx.symbol.type] :
      this.parserRules[ctx.ruleIndex];
  }

  printChildren(ctx) {
    for (let i = 0; i < ctx.getChildCount(); i++) {
      let child = ctx.getChild(i);
      console.log(i, child.getText(), this.getRuleName(child));
    }
  }

  flatten(toks) {
    if (!Array.isArray(toks)) toks = [toks];
    return toks.reduce((acc, t) => acc += '[' + this.getRuleName(t) + ':' + t.getText() + ']', '');
  }

  flattenChoice(toks) {
    if (!Array.isArray(toks)) toks = [toks];
    return toks.reduce((acc, t) => acc += '[' + this.getRuleName(t) + ':' + t.getText() + ']', 'choice: ');
  }

  appendToArray(orig, adds) {
    return (adds && adds.length) ? (orig || []).concat(adds) : orig;
  }

  visitSymbol(ctx) {
    let ident = ctx.ident().getText();
    if (ident.length && ident[0] === '$') ident = ident.substring(1);
    let token = new Symbol(this, ident);
    token.transforms = this.inheritTransforms(token, ctx);
    return this.visit(token);
  }

  inheritTransforms(token, ctx) {
    let newTransforms = ctx.transform().map(t => t.getText().substring(1, t.getText().length - 2));
    newTransforms = this.appendToArray(newTransforms, ctx.transforms);
    return this.appendToArray(token.transforms, newTransforms);
  }

  visitFullChoice(ctx) {
    let options = ctx.expr();
    let token = this.randomElement(options);
    token.transforms = this.inheritTransforms(token, ctx);
    return this.visit(token);
  }

  visitEmptyChoice(ctx) { // TODO: remove?
    let options = ctx.expr().concat("");
    let token = this.randomElement(options);
    if (typeof token === 'string') return token; // fails for transforms
    token.transforms = this.inheritTransforms(token, ctx);
    return this.visit(token);
  }

  randomElement(arr) {
    return arr[Math.floor((Math.random() * arr.length))];
  }
}

module.exports = Visitor;
