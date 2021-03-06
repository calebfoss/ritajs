describe('RiTa.Core', () => {

  if (typeof module !== 'undefined') require('./before');

  it('Should have access to statics', () => {
    //console.log(process.env.NODE_ENV, process.env.npm_package_version, RiTa.VERSION);
    if (typeof process === 'undefined') return; // TODO:

    if (typeof process.env.npm_package_version !== 'undefined' &&
      typeof process.env.NODE_ENV !== 'undefined') {
      eql(RiTa.VERSION, process.env.npm_package_version);
    }
    else {
      eql(RiTa.VERSION, 'DEV');
    } 
    eql(RiTa.hasWord('dog'), true);
  });

  it('Should call randomOrdering', () => {
    expect(RiTa.randomOrdering(1)).eql([0]);
    expect(RiTa.randomOrdering(2)).to.have.members([0, 1])
    expect(RiTa.randomOrdering(['a'])).eql(['a']);
    expect(RiTa.randomOrdering(['a', 'b'])).to.have.members(['a', 'b']);
  });

  it('Should call isQuestion', () => {
    ok(RiTa.isQuestion("what"));
    ok(RiTa.isQuestion("what"));
    ok(RiTa.isQuestion("what is this"));
    ok(RiTa.isQuestion("what is this?"));
    ok(RiTa.isQuestion("Does it?"));
    ok(RiTa.isQuestion("Would you believe it?"));
    ok(RiTa.isQuestion("Have you been?"));
    ok(RiTa.isQuestion("Is this yours?"));
    ok(RiTa.isQuestion("Are you done?"));
    ok(RiTa.isQuestion("what is this? , where is that?"));
    ok(!RiTa.isQuestion("That is not a toy This is an apple"));
    ok(!RiTa.isQuestion("string"));
    ok(!RiTa.isQuestion("?"));
    ok(!RiTa.isQuestion(""));
  });

  it('Should handle articlize', () => {
    let data = [
      "dog", "a dog",
      "ant", "an ant",
      "eagle", "an eagle",
      "ermintrout", "an ermintrout"
    ];
    if (RiTa.lexicon().size() > 0) {
      data.push( "honor", "an honor");
    }
    for (let i = 0; i < data.length; i += 2) {
      expect(RiTa.articlize(data[i])).eq(data[i + 1]);
    }
  });

  it('Should handle articlize phrases', () => {
    let data = [
      "black dog", "a black dog",
      "black ant", "a black ant",
      "orange ant", "an orange ant"
    ];
    for (let i = 0; i < data.length; i += 2) {
      expect(RiTa.articlize(data[i])).eq(data[i + 1]);
    }
  });

  it('Should call isAbbrev', () => {

    ok(RiTa.isAbbrev("Dr."));
    ok(RiTa.isAbbrev("dr."));
    ok(RiTa.isAbbrev("DR."));
    ok(RiTa.isAbbrev("Dr. "));
    ok(RiTa.isAbbrev(" Dr."));
    ok(RiTa.isAbbrev("Prof."));
    ok(RiTa.isAbbrev("prof."));

    ok(!RiTa.isAbbrev("Dr"));
    ok(!RiTa.isAbbrev("Doctor"));
    ok(!RiTa.isAbbrev("Doctor."));
    ok(!RiTa.isAbbrev("PRFO."));
    ok(!RiTa.isAbbrev("PrFo."));
    ok(!RiTa.isAbbrev("Professor"));
    ok(!RiTa.isAbbrev("professor"));
    ok(!RiTa.isAbbrev("PROFESSOR"));
    ok(!RiTa.isAbbrev("Professor."));
    ok(!RiTa.isAbbrev("@#$%^&*()"));
    ok(!RiTa.isAbbrev(""));
    ok(!RiTa.isAbbrev(null));
    ok(!RiTa.isAbbrev(undefined));
    ok(!RiTa.isAbbrev(1));

    ok(RiTa.isAbbrev("Dr.", { caseSensitive: true }));
    ok(RiTa.isAbbrev("Dr. ", { caseSensitive: true }));
    ok(RiTa.isAbbrev(" Dr.", { caseSensitive: true }));
    ok(RiTa.isAbbrev("Prof.", { caseSensitive: true }));

    ok(!RiTa.isAbbrev("dr.", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("DR.", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("Dr", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("Doctor", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("Doctor.", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("prof.", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("PRFO.", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("PrFo.", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("Professor", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("professor", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("PROFESSOR", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("Professor.", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("@#$%^&*()", { caseSensitive: true }));
    ok(!RiTa.isAbbrev("", { caseSensitive: true }));
    ok(!RiTa.isAbbrev(null, { caseSensitive: true }));
    ok(!RiTa.isAbbrev(undefined, { caseSensitive: true }));
    ok(!RiTa.isAbbrev(1, { caseSensitive: true }));
  });

  it('Should call isPunct', () => {

    ok(!RiTa.isPunct("What the"));
    ok(!RiTa.isPunct("What ! the"));
    ok(!RiTa.isPunct(".#\"\\!@i$%&_+=}<>"));

    ok(RiTa.isPunct("!"));
    ok(RiTa.isPunct("?"));
    ok(RiTa.isPunct("?!"));
    ok(RiTa.isPunct("."));
    ok(RiTa.isPunct(".."));
    ok(RiTa.isPunct("..."));
    ok(RiTa.isPunct("...."));
    ok(RiTa.isPunct("%..."));

    ok(!RiTa.isPunct("! "));
    //space
    ok(!RiTa.isPunct(" !"));
    //space
    ok(!RiTa.isPunct("!  "));
    //double space
    ok(!RiTa.isPunct("  !"));
    //double space
    ok(!RiTa.isPunct("!  "));
    //tab space
    ok(!RiTa.isPunct("   !"));

    let punct;

    punct = '$%&^,';
    for (let i = 0; i < punct.length; i++) {
      ok(RiTa.isPunct(punct[i]));
    }

    punct = ",;:!?)([].#\"\\!@$%&}<>|-\/\\*{^";
    for (let i = 0; i < punct.length; i++) {
      ok(RiTa.isPunct(punct[i]));
    }

    // TODO: also test multiple characters strings here ****
    punct = "\"��������`'";
    for (let i = 0; i < punct.length; i++) {
      ok(RiTa.isPunct(punct[i]));
    }

    punct = "\"��������`',;:!?)([].#\"\\!@$%&}<>|-\/\\*{^";
    for (let i = 0; i < punct.length; i++) {
      ok(RiTa.isPunct(punct[i]));
    }

    // TODO: and here...
    let nopunct = 'Helloasdfnals  FgG   \t kjdhfakjsdhf askjdfh aaf98762348576';
    for (let i = 0; i < nopunct.length; i++) {
      ok(!RiTa.isPunct(nopunct[i]));
    }

    ok(!RiTa.isPunct(""));
  });

  it('Should call tokenize', () => {

    expect(RiTa.tokenize("")).eql([""]);
    expect(RiTa.tokenize("The dog")).eql(["The", "dog"]);

    let input, expected, output;

    input = "The student said 'learning is fun'";
    expected = ["The", "student", "said", "'", "learning", "is", "fun", "'"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = '"Oh God," he thought.';
    expected = ['"', 'Oh', 'God', ',', '"', 'he', 'thought', '.'];
    output = RiTa.tokenize(input);
    //console.log(expected,output);
    expect(output).eql(expected);

    input = "The boy, dressed in red, ate an apple.";
    expected = ["The", "boy", ",", "dressed", "in", "red", ",", "ate", "an", "apple", "."];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "why? Me?huh?!";
    expected = ["why", "?", "Me", "?", "huh", "?", "!"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "123 123 1 2 3 1,1 1.1 23.45.67 22/05/2012 12th May,2012";
    expected = ["123", "123", "1", "2", "3", "1", ",", "1", "1", ".", "1", "23", ".", "45", ".", "67", "22/05/2012", "12th", "May", ",", "2012"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = 'The boy screamed, "Where is my apple?"';
    expected = ["The", "boy", "screamed", ",", "\"", "Where", "is", "my", "apple", "?", "\""];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = 'The boy screamed, \u201CWhere is my apple?\u201D';
    expected = ["The", "boy", "screamed", ",", "\u201C", "Where", "is", "my", "apple", "?", "\u201D"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "The boy screamed, 'Where is my apple?'";
    expected = ["The", "boy", "screamed", ",", "'", "Where", "is", "my", "apple", "?", "'"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "The boy screamed, \u2018Where is my apple?\u2019";
    expected = ["The", "boy", "screamed", ",", "\u2018", "Where", "is", "my", "apple", "?", "\u2019"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "dog, e.g. the cat.";
    expected = ["dog", ",", "e.g.", "the", "cat", "."];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "dog, i.e. the cat.";
    expected = ["dog", ",", "i.e.", "the", "cat", "."];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "What does e.g. mean? E.g. is used to introduce a few examples, not a complete list.";
    expected = ["What", "does", "e.g.", "mean", "?", "E.g.", "is", "used", "to", "introduce", "a", "few", "examples", ",", "not", "a", "complete", "list", "."];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "What does i.e. mean? I.e. means in other words.";
    expected = ["What", "does", "i.e.", "mean", "?", "I.e.", "means", "in", "other", "words", "."];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "it cost $30";
    expected = ["it", "cost", "$", "30"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "calculate 2^3";
    expected = ["calculate", "2", "^", "3"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "30% of the students";
    expected = ["30", "%", "of", "the", "students"];
    output = RiTa.tokenize(input);
    expect(output).eql(expected);

    input = "it's 30°C outside";
    expected = ["it", "is", "30", "°", "C", "outside"];
    RiTa.SPLIT_CONTRACTIONS = true;
    output = RiTa.tokenize(input);
    RiTa.SPLIT_CONTRACTIONS = false;
    expect(output).eql(expected);

    // reference :PENN treebank tokenization document :ftp://ftp.cis.upenn.edu/pub/treebank/public_html/tokenization.html
    //            and aslo English punctuation Wiki page Latin abbreviations Wiki page
    let inputs = ["A simple sentence.",
      "that's why this is our place).",
      "most, punctuation; is. split: from! adjoining words?",
      "double quotes \"OK\"", //Treebank tokenization document says double quotes (") are changed to doubled single forward- and backward- quotes (`` and '') tho
      "face-to-face class",
      '"it is strange", said John, "Katherine does not drink alchol."',
      '"What?!", John yelled.',
      "more abbreviations: a.m. p.m. Cap. c. et al. etc. P.S. Ph.D R.I.P vs. v. Mr. Ms. Dr. Pf. Mx. Ind. Inc. Corp. Co.,Ltd. Co., Ltd. Co. Ltd. Ltd. Prof.",
      "elipsis dots... another elipsis dots…",
      "(testing) [brackets] {all} ⟨kinds⟩",
    ];

    let outputs = [
      ["A", "simple", "sentence", "."],
      ["that's", "why", "this", "is", "our", "place", ")", "."],
      ["most", ",", "punctuation", ";", "is", '.', 'split', ':', "from", "!", "adjoining", "words", "?"],
      ["double", "quotes", "\"", "OK", "\""],
      ["face-to-face", "class"],
      ["\"", "it", "is", "strange", "\"", ",", "said", "John", ",", "\"", "Katherine", "does", "not", "drink", "alchol", ".", "\""],
      ["\"", "What", "?", "!", "\"", ",", "John", "yelled", "."],
      ["more", "abbreviations", ":", "a.m.", "p.m.", "Cap.", "c.", "et al.", "etc.", "P.S.", "Ph.D", "R.I.P", "vs.", "v.", "Mr.", "Ms.", "Dr.", "Pf.", "Mx.", "Ind.", "Inc.", "Corp.", "Co.,Ltd.", "Co., Ltd.", "Co. Ltd.", "Ltd.", "Prof."],
      ["elipsis", "dots", "...", "another", "elipsis", "dots", "…"],
      ["(", "testing", ")", "[", "brackets", "]", "{", "all", "}", "⟨", "kinds", "⟩"],//this might not need to be fix coz ⟨⟩ is rarely seen
    ];

    expect(inputs.length).eq(outputs.length);
    for (let i = 0; i < inputs.length; i++) {
      expect(RiTa.tokenize(inputs[i])).eql(outputs[i]);
    }

    // contractions -------------------------

    let txt1 = "Dr. Chan is talking slowly with Mr. Cheng, and they're friends."; // strange but same as RiTa-java
    let txt2 = "He can't didn't couldn't shouldn't wouldn't eat.";
    let txt3 = "Wouldn't he eat?";
    let txt4 = "It's not that I can't.";
    let txt5 = "We've found the cat.";
    let txt6 = "We didn't find the cat.";

    RiTa.SPLIT_CONTRACTIONS = true;
    expect(RiTa.tokenize(txt1)).eql(["Dr.", "Chan", "is", "talking", "slowly", "with", "Mr.", "Cheng", ",", "and", "they", "are", "friends", "."]);
    expect(RiTa.tokenize(txt2)).eql(["He", "can", "not", "did", "not", "could", "not", "should", "not", "would", "not", "eat", "."]);
    expect(RiTa.tokenize(txt3)).eql(["Would", "not", "he", "eat", "?"]);
    expect(RiTa.tokenize(txt4)).eql(["It", "is", "not", "that", "I", "can", "not", "."]);
    expect(RiTa.tokenize(txt5)).eql(["We", "have", "found", "the", "cat", "."]);
    expect(RiTa.tokenize(txt6)).eql(["We", "did", "not", "find", "the", "cat", "."]);

    RiTa.SPLIT_CONTRACTIONS = false;
    expect(RiTa.tokenize(txt1)).eql(["Dr.", "Chan", "is", "talking", "slowly", "with", "Mr.", "Cheng", ",", "and", "they're", "friends", "."]);
    expect(RiTa.tokenize(txt2)).eql(["He", "can't", "didn't", "couldn't", "shouldn't", "wouldn't", "eat", "."]);
    expect(RiTa.tokenize(txt3)).eql(["Wouldn't", "he", "eat", "?"]);
    expect(RiTa.tokenize(txt4)).eql(["It's", "not", "that", "I", "can't", "."]);
    expect(RiTa.tokenize(txt5)).eql(["We've", "found", "the", "cat", "."]);
    expect(RiTa.tokenize(txt6)).eql(["We", "didn't", "find", "the", "cat", "."]);
  });

  it('Should call untokenize', () => {

    let input, output, expected;

    expect(RiTa.untokenize([""])).eq("");

    expected = "We should consider the students' learning";
    input = ["We", "should", "consider", "the", "students", "'", "learning"];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "The boy, dressed in red, ate an apple.";
    input = ["The", "boy", ",", "dressed", "in", "red", ",", "ate", "an", "apple", "."];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "We should consider the students\u2019 learning";
    input = ["We", "should", "consider", "the", "students", "\u2019", "learning"];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "The boy screamed, 'Where is my apple?'";
    input = ["The", "boy", "screamed", ",", "'", "Where", "is", "my", "apple", "?", "'"];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "Dr. Chan is talking slowly with Mr. Cheng, and they're friends."; // strange but same as RiTa-java
    input = ["Dr", ".", "Chan", "is", "talking", "slowly", "with", "Mr", ".", "Cheng", ",", "and", "they're", "friends", "."];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    input = ["why", "?", "Me", "?", "huh", "?", "!"];
    expected = "why? Me? huh?!";
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    input = ["123", "123", "1", "2", "3", "1", ",", "1", "1", ".", "1", "23", ".", "45", ".", "67", "22/05/2012", "12th", "May", ",", "2012"];
    expected = "123 123 1 2 3 1, 1 1. 1 23. 45. 67 22/05/2012 12th May, 2012";
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    input = ['"', 'Oh', 'God', ',', '"', 'he', 'thought', '.'];
    expected = '"Oh God," he thought.';
    output = RiTa.untokenize(input);
    //console.log(expected,'\n',output);
    expect(output).eq(expected);

    expected = "The boy screamed, 'Where is my apple?'";
    input = ["The", "boy", "screamed", ",", "'", "Where", "is", "my", "apple", "?", "'"];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    input = ['She', 'screamed', ',', '"', 'Oh', 'God', '!', '"'];
    expected = 'She screamed, "Oh God!"';
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    input = ['She', 'screamed', ':', '"', 'Oh', 'God', '!', '"'];
    expected = 'She screamed: "Oh God!"';
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    input = ["\"", "Oh", ",", "God", "\"", ",", "he", "thought", ",", "\"", "not", "rain", "!", "\""];
    expected = "\"Oh, God\", he thought, \"not rain!\"";
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "The student said 'learning is fun'";
    input = ["The", "student", "said", "'", "learning", "is", "fun", "'"];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "dog, e.g. the cat.";
    input = ["dog", ",", "e.g.", "the", "cat", "."];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "dog, i.e. the cat.";
    input = ["dog", ",", "i.e.", "the", "cat", "."];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "What does e.g. mean? E.g. is used to introduce a few examples, not a complete list.";
    input = ["What", "does", "e.g.", "mean", "?", "E.g.", "is", "used", "to", "introduce", "a", "few", "examples", ",", "not", "a", "complete", "list", "."];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    expected = "What does i.e. mean? I.e. means in other words.";
    input = ["What", "does", "i.e.", "mean", "?", "I.e.", "means", "in", "other", "words", "."];
    output = RiTa.untokenize(input);
    expect(output).eq(expected);

    // refere to english punctuation marks list on Wiki

    let outputs = ["A simple sentence.",
      "that's why this is our place).",
      "this is for semicolon; that is for else",
      "this is for 2^3 2*3",
      "this is for $30 and #30",
      "this is for 30°C or 30\u2103",
      "this is for a/b a⁄b",
      "this is for «guillemets»",
      "this... is… for ellipsis",
      "this line is 'for' single ‘quotation’ mark",
      "Katherine’s cat and John's cat",
      "this line is for (all) [kind] {of} ⟨brackets⟩ done",
      "this line is for the-dash",
      "30% of the student love day-dreaming.",
      '"that test line"',
      "my email address is name@domin.com",
      "it is www.google.com",
      "that is www6.cityu.edu.hk"
    ];

    let inputs = [
      ["A", "simple", "sentence", "."],
      ["that's", "why", "this", "is", "our", "place", ")", "."],
      ["this", "is", "for", "semicolon", ";", "that", "is", "for", "else"],
      ["this", "is", "for", "2", "^", "3", "2", "*", "3"],
      ["this", "is", "for", "$", "30", "and", "#", "30"],
      ["this", "is", "for", "30", "°", "C", "or", "30", "\u2103"],
      ["this", "is", "for", "a", "/", "b", "a", "⁄", "b"],
      ["this", "is", "for", "«", "guillemets", "»"],
      ["this", "...", "is", "…", "for", "ellipsis"],
      ["this", "line", "is", "'", "for", "'", "single", "‘", "quotation", "’", "mark"],
      ["Katherine", "’", "s", "cat", "and", "John", "'", "s", "cat"],
      ["this", "line", "is", "for", "(", "all", ")", "[", "kind", "]", "{", "of", "}", "⟨", "brackets", "⟩", "done"],
      ["this", "line", "is", "for", "the", "-", "dash"],
      ["30", "%", "of", "the", "student", "love", "day", "-", "dreaming", "."],
      ['"', "that", "test", "line", '"'],
      ["my", "email", "address", "is", "name", "@", "domin", ".", "com"],
      ["it", "is", "www", ".", "google", ".", "com"],
      ["that", "is", "www6", ".", "cityu", ".", "edu", ".", "hk"]
    ];

    expect(inputs.length).eq(outputs.length);
    for (let i = 0; i < inputs.length; i++) {
      expect(RiTa.untokenize(inputs[i])).eq(outputs[i]);
    }
  });

  it('Should call concordance', () => {

    let data = RiTa.concordance("The dog ate the cat"); //default
    expect(Object.keys(data).length).eq(5);
    expect(data["the"]).eq(1);
    expect(data["The"]).eq(1);
    expect(data["THE"]).eq(undefined);

    data = RiTa.concordance("The dog ate the cat", {
      ignoreCase: false,
      ignoreStopWords: false,
      ignorePunctuation: false,
    });

    expect(Object.keys(data).length).eq(5);
    expect(data["the"]).eq(1);
    expect(data["The"]).eq(1);
    expect(data["THE"]).eq(undefined); // same result

    data = RiTa.concordance("The dog ate the cat", {
      ignoreCase: true
    });
    expect(Object.keys(data).length).eq(4);
    expect(data["the"]).eq(2);
    expect(data["The"]).eq(undefined);
    expect(data["THE"]).eq(undefined);

    data = RiTa.concordance("The Dog ate the cat.", {
      ignoreCase: true,
      ignoreStopWords: true,
      ignorePunctuation: true,
    });

    expect(Object.keys(data).length).eq(3);
    expect(data["dog"]).eq(1);
    expect(data["the"]).eq(undefined);
    expect(data["THE"]).eq(undefined);

    // opts should be back to default
    data = RiTa.concordance("The dog ate the cat");
    expect(Object.keys(data).length).eq(5);
    expect(data["the"]).eq(1);
    expect(data["The"]).eq(1);
    expect(data["THE"]).eq(undefined);

    data = RiTa.concordance("'What a wonderful world;!:,?.'\"", {
      ignorePunctuation: true
    });
    expect(Object.keys(data).length).eq(4);
    expect(data["!"]).eq(undefined);


    data = RiTa.concordance("The dog ate the cat", {
      ignoreStopWords: true
    });

    expect(Object.keys(data).length).eq(3);
    expect(data["The"]).eq(undefined);

    data = RiTa.concordance("It was a dream of you.", { // 'dream', '.'
      ignoreStopWords: true
    });
    expect(Object.keys(data).length).eq(2);
    expect(data["It"]).eq(undefined);
    expect(data["dream"]).eq(1);
    expect(data["."]).eq(1);

    data = RiTa.concordance("Fresh fried fish, Fish fresh fried.", {
      wordsToIgnore: ["fish"],
      ignoreCase: true,
      ignorePunctuation: true
    });
    expect(Object.keys(data).length).eq(2);
    expect(data["fish"]).eq(undefined);
    expect(data["fresh"]).eq(2);
    expect(data["fried"]).eq(2);
  });

  it('Should call kwic',() => {
    let result;
    RiTa.concordance("A sentence includes cat."); 
    result = RiTa.kwic("cat");
    expect(result[0]).eq("A sentence includes cat.");

    RiTa.concordance("Cats are beautiful.");
    result = RiTa.kwic("cat");
    expect(result.length).eq(0);

    RiTa.concordance("This is a very very long sentence includes cat with many many words after it and before it.");
    result = RiTa.kwic("cat");
    expect(result[0]).eq("a very very long sentence includes cat with many many words after it");

    RiTa.concordance("A sentence includes cat in the middle. Another sentence includes cat in the middle.");
    result = RiTa.kwic("cat");
    expect(result[0]).eq("A sentence includes cat in the middle. Another sentence");
    expect(result[1]).eq("the middle. Another sentence includes cat in the middle.");

    RiTa.concordance("A sentence includes cat. Another sentence includes cat.");
    result = RiTa.kwic("cat");
    expect(result[0]).eq("A sentence includes cat. Another sentence includes cat.");
    expect(result[1]).eq(undefined);

    RiTa.concordance("A sentence includes cat. Another sentence includes cat.");
    result = RiTa.kwic("cat", 4);
    expect(result[0]).eq("A sentence includes cat. Another sentence includes");
    expect(result[1]).eq(". Another sentence includes cat.");

    RiTa.concordance("The dog ate the cat, what a tragedy! Little Kali loves the cat, it was her best friend.");
    result = RiTa.kwic("cat", 4);
    expect(result[0]).eq("The dog ate the cat, what a tragedy");
    expect(result[1]).eq("Little Kali loves the cat, it was her");
  });

  it('Should call sentences', () => {

    let input, expected, output;

    eql(RiTa.sentences(''), ['']);

    input = "Stealth's Open Frame, OEM style LCD monitors are designed for special mounting applications. The slim profile packaging provides an excellent solution for building into kiosks, consoles, machines and control panels. If you cannot find an off the shelf solution call us today about designing a custom solution to fit your exact needs.";
    expected = ["Stealth's Open Frame, OEM style LCD monitors are designed for special mounting applications.", "The slim profile packaging provides an excellent solution for building into kiosks, consoles, machines and control panels.", "If you cannot find an off the shelf solution call us today about designing a custom solution to fit your exact needs."];
    output = RiTa.sentences(input);
    eql(output, expected);

    input = "\"The boy went fishing.\", he said. Then he went away.";
    expected = ["\"The boy went fishing.\", he said.", "Then he went away."];
    output = RiTa.sentences(input);
    eql(output, expected);

    input = "The dog";
    output = RiTa.sentences(input);
    eql(output, [input]);

    input = "I guess the dog ate the baby.";
    output = RiTa.sentences(input);
    eql(output, [input]);

    input = "Oh my god, the dog ate the baby!";
    output = RiTa.sentences(input);
    expected = ["Oh my god, the dog ate the baby!"];
    eql(output, expected);

    input = "Which dog ate the baby?"
    output = RiTa.sentences(input);
    expected = ["Which dog ate the baby?"];
    eql(output, expected);

    input = "'Yes, it was a dog that ate the baby', he said."
    output = RiTa.sentences(input);
    expected = ["\'Yes, it was a dog that ate the baby\', he said."];
    eql(output, expected);

    input = "The baby belonged to Mr. and Mrs. Stevens. They will be very sad.";
    output = RiTa.sentences(input);
    expected = ["The baby belonged to Mr. and Mrs. Stevens.", "They will be very sad."];
    eql(output, expected);

    // More quotation marks
    input = "\"The baby belonged to Mr. and Mrs. Stevens. They will be very sad.\"";
    output = RiTa.sentences(input);
    expected = ["\"The baby belonged to Mr. and Mrs. Stevens.", "They will be very sad.\""];
    eql(output, expected);

    input = "\u201CThe baby belonged to Mr. and Mrs. Stevens. They will be very sad.\u201D";
    output = RiTa.sentences(input);
    expected = ["\u201CThe baby belonged to Mr. and Mrs. Stevens.", "They will be very sad.\u201D"];
    eql(output, expected);

    //https://github.com/dhowe/RiTa/issues/498
    input = "\"My dear Mr. Bennet. Netherfield Park is let at last.\"";
    output = RiTa.sentences(input);
    expected = ["\"My dear Mr. Bennet.", "Netherfield Park is let at last.\""];
    eql(output, expected);

    input = "\u201CMy dear Mr. Bennet. Netherfield Park is let at last.\u201D";
    output = RiTa.sentences(input);
    expected = ["\u201CMy dear Mr. Bennet.", "Netherfield Park is let at last.\u201D"];
    eql(output, expected);
    /*******************************************/

    input = "She wrote: \"I don't paint anymore. For a while I thought it was just a phase that I'd get over.\"";
    output = RiTa.sentences(input);
    expected = ["She wrote: \"I don't paint anymore.", "For a while I thought it was just a phase that I'd get over.\""];
    eql(output, expected);

    input = " I had a visit from my \"friend\" the tax man.";
    output = RiTa.sentences(input);
    expected = ["I had a visit from my \"friend\" the tax man."];
    eql(output, expected);
  });

  function ok(a, m) { expect(a, m).to.be.true; }
  function def(res, m) { expect(res, m).to.not.be.undefined; }
  function eql(a, b, m) { expect(a).eql(b, m); }
  function eq(a, b, m) { expect(a).eq(b, m); }
});
