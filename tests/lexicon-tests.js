const expect = require('chai').expect;
const RiTa = require('../src/rita_core');

describe('RiTa.Lexicon', () => {

  it('Should correctly call alliterations()', () => {

    let result;

    // TODO: make sure we have LTS cases in here

    result = RiTa.alliterations("");
    ok(result.length < 1);

    result = RiTa.alliterations("#$%^&*");
    ok(result.length < 1);

    result = RiTa.alliterations("umbrella");
    ok(result.length < 1);

    result = RiTa.alliterations("cat stress");
    ok(result.length > 2000);

    result = RiTa.alliterations("cat");
    ok(result.length > 2000);
    for (let i = 0; i < result.length; i++) {
      ok(RiTa.isAlliteration(result[i], "cat"));
    }

    result = RiTa.alliterations("dog");
    ok(result.length > 1000);
    for (let i = 0; i < result.length; i++) {
      ok(RiTa.isAlliteration(result[i], "dog"));
    }

    result = RiTa.alliterations("dog", { matchMinLength: 15 });
    ok(result.length < 5, "got length=" + result.length);
    for (let i = 0; i < result.length; i++) {
      ok(RiTa.isAlliteration(result[i], "dog"), 'FAIL1: ' + result[i]);
    }

    result = RiTa.alliterations("cat", { matchMinLength: 16 });
    ok(result.length < 15);
    for (let i = 0; i < result.length; i++) {
      ok(RiTa.isAlliteration(result[i], "cat"), 'FAIL2: ' + result[i]);
    }
  });

  // NEXT
  it('Should correctly call rhymes()', () => {

    ok(RiTa.rhymes("cat").includes("hat"));
    ok(RiTa.rhymes("yellow").includes("mellow"));
    ok(RiTa.rhymes("toy").includes("boy"));
    ok(RiTa.rhymes("sieve").includes("give"));

    ok(RiTa.rhymes("tense").includes("sense"));
    ok(RiTa.rhymes("crab").includes("drab"));
    ok(RiTa.rhymes("shore").includes("more"));

    ok(RiTa.rhymes("mouse").includes("house"));

    ok(RiTa.rhymes("weight").includes("eight"));
    ok(RiTa.rhymes("eight").includes("weight"));

    ok(!RiTa.rhymes("apple").includes("polo"));
    ok(!RiTa.rhymes("this").includes( "these"));

    ok(!RiTa.rhymes("hose").includes("house"));
    ok(!RiTa.rhymes("sieve").includes("mellow"));
    ok(!RiTa.rhymes("swag").includes("grab"));
  });

  // WORKING HERE: check RiTa v1 for options

  it('Should correctly call similarBy(Letter)', () => {
    return;
    let result;

    result = RiTa.similarByLetter("banana", true);
    deepEqual(result, ["cabana"]);

    result = RiTa.similarByLetter("banana", false);
    deepEqual(result, ["banal", "bonanza", "cabana", "manna"]);

    //delete the word 'lice', not exists anymore in dict.
    result = RiTa.similarByLetter("banana");
    deepEqual(result, ["banal", "bonanza", "cabana", "manna"]);

    result = RiTa.similarByLetter("banana", 1, true);
    deepEqual(result, ["cabana"]);

    result = RiTa.similarByLetter("banana", 1, false);
    deepEqual(result, ["banal", "bonanza", "cabana", "manna"]);

    result = RiTa.similarByLetter("tornado");
    deepEqual(result, ["torpedo"]);

    result = RiTa.similarByLetter("ice");
    deepEqual(result, ["ace", "dice", "iced", "icy", "ire", "nice", "rice", "vice"]);

    result = RiTa.similarByLetter("ice", 1);
    deepEqual(result, ["ace", "dice", "iced", "icy", "ire", "nice", "rice", "vice"]);

    result = RiTa.similarByLetter("ice", 2, true);
    ok(result.length > 10);

    result = RiTa.similarByLetter("ice", 0, true); // defaults to 1
    deepEqual(result, ["ace", "icy", "ire"]);

    result = RiTa.similarByLetter("ice", 1, true);
    deepEqual(result, ["ace", "icy", "ire"]);

    result = RiTa.similarByLetter("worngword");
    deepEqual(result, ["foreword", "wormwood"]);

    result = RiTa.similarByLetter("123");
    ok(result.length > 400);

    result = RiTa.similarByLetter("");
    deepEqual(result, []);
  });

  it('Should correctly call similarBy(Sound)', () => {
    return;
    let result, answer;

    deepEqual(RiTa.similarBySound("tornado"), ["torpedo"]);

    result = RiTa.similarBySound("try");
    answer = ["cry", "dry", "fry", "pry", "rye", "tie", "tray", "tree", "tribe", "tried", "tripe", "trite", "true", "wry"];
    deepEqual(result, answer);

    result = RiTa.similarBySound("try", 2);
    ok(result.length > answer.length); // more

    result = RiTa.similarBySound("happy");
    answer = ["happier", "hippie"];
    deepEqual(result, answer);

    result = RiTa.similarBySound("happy", 2);
    ok(result.length > answer.length); // more

    result = RiTa.similarBySound("cat");
    answer = ["at", "bat", "cab", "cache", "calf", "calve", "can", "can\'t", "cap", "capped", "cash", "cashed", "cast", "caste", "catch", "catty", "caught", "chat", "coat", "cot", "curt", "cut", "fat", "hat", "kit", "kite", "mat", "matt", "matte", "pat", "rat", "sat", "tat", "that", "vat"];
    deepEqual(result, answer);

    result = RiTa.similarBySound("cat", 2);
    ok(result.length > answer.length);

    result = RiTa.similarBySound("worngword");
    deepEqual(result, ["watchword", "wayward", "wormwood"]);
  });

  it('Should correctly call similarBy(SoundAndLetter)', () => {
    return;
    let result = RiTa.similarBySoundAndLetter("try");
    deepEqual(result, ["cry", "dry", "fry", "pry", "tray", "wry"]);

    result = RiTa.similarBySoundAndLetter("daddy");
    deepEqual(result, ["dandy", "paddy"]);

    result = RiTa.similarBySoundAndLetter("banana");
    deepEqual(result, ["bonanza"]);

    result = RiTa.similarBySoundAndLetter("worngword");
    deepEqual(result, ["wormwood"]);

    result = RiTa.similarBySoundAndLetter("");
    deepEqual(result, []);
  });

  it('Should correctly call isRhyme()', () => {
    ok(!RiTa.isRhyme("apple", "polo"));
    ok(!RiTa.isRhyme("this", "these"));

    ok(RiTa.isRhyme("cat", "hat"));
    ok(RiTa.isRhyme("yellow", "mellow"));
    ok(RiTa.isRhyme("toy", "boy"));
    ok(RiTa.isRhyme("sieve", "give"));

    ok(RiTa.isRhyme("solo", "tomorrow"));
    ok(RiTa.isRhyme("tense", "sense"));
    ok(RiTa.isRhyme("crab", "drab"));
    ok(RiTa.isRhyme("shore", "more"));
    ok(!RiTa.isRhyme("hose", "house"));
    ok(!RiTa.isRhyme("sieve", "mellow"));

    ok(RiTa.isRhyme("mouse", "house")); //why??
    // ok(!RiTa.isRhyme("solo", "yoyo"));
    // ok(!RiTa.isRhyme("yoyo", "jojo")); -> Known Issues

    ok(RiTa.isRhyme("yo", "bro"));
    ok(!RiTa.isRhyme("swag", "grab"));
    ok(!RiTa.isRhyme("", ""));

    ok(RiTa.isRhyme("weight", "eight"));
    ok(RiTa.isRhyme("eight", "weight"));
  });

  it('Should correctly call isAlliteration()', () => {

    ok(RiTa.isAlliteration("knife", "gnat")); // gnat=lts
    ok(RiTa.isAlliteration("knife", "naughty"));

    ok(RiTa.isAlliteration("sally", "silly"));
    ok(RiTa.isAlliteration("sea", "seven"));
    ok(RiTa.isAlliteration("silly", "seven"));
    ok(RiTa.isAlliteration("sea", "sally"));

    ok(RiTa.isAlliteration("big", "bad"));
    ok(RiTa.isAlliteration("bad", "big")); // swap position

    ok(RiTa.isAlliteration("BIG", "bad")); // CAPITAL LETTERS
    ok(RiTa.isAlliteration("big", "BAD")); // CAPITAL LETTERS
    ok(RiTa.isAlliteration("BIG", "BAD")); // CAPITAL LETTERS
    ok(RiTa.isAlliteration("this", "these"));

    // False
    ok(!RiTa.isAlliteration("", ""));
    ok(!RiTa.isAlliteration("wind", "withdraw"));
    ok(!RiTa.isAlliteration("solo", "tomorrow"));
    ok(!RiTa.isAlliteration("solo", "yoyo"));
    ok(!RiTa.isAlliteration("yoyo", "jojo"));
    ok(!RiTa.isAlliteration("cat", "access"));

    ok(RiTa.isAlliteration("unsung", "sine"));
    ok(RiTa.isAlliteration("job", "gene"));
    ok(RiTa.isAlliteration("jeans", "gentle"));

    ok(RiTa.isAlliteration("abet", "better"));
    ok(RiTa.isAlliteration("psychology", "cholera"));
    ok(RiTa.isAlliteration("consult", "sultan"));
    ok(RiTa.isAlliteration("never", "knight"));
    ok(RiTa.isAlliteration("knight", "navel"));
    ok(RiTa.isAlliteration("monsoon", "super"));
    ok(RiTa.isAlliteration("cat", "kitchen"));

    // not counting assonance
    ok(!RiTa.isAlliteration("octopus", "oblong"));
    ok(!RiTa.isAlliteration("omen", "open"));
    ok(!RiTa.isAlliteration("amicable", "atmosphere"));
  });

  function deepEqual(output, expected, msg) { expect(output).eql(expected, msg); }
  function ok(res, msg) { expect(res).eq(true, msg); }
  function equal(a, b, msg) { expect(a).eq(b, msg); }
});