const {expect} = require("chai");
const {decode} = require("../index.js");

describe("aritz.conf decoder", function() {
	it("returns an empty object when given nothing", function() {
		expect(
			decode("")
		).to.deep.equal(
			{}
		);
		expect(
			decode()
		).to.deep.equal(
			{}
		);
	});

	it("decodes a single thing", function() {
		expect(
			decode("hello world\n")
		).to.deep.equal({
			hello: "world"
		});
	});
	it("Ignores blank keys", function() {
		expect(
			decode("aaaa\n")
		).to.deep.equal(
			{}
		);
		expect(
			decode("aaaa")
		).to.deep.equal(
			{}
		);
		expect(
			decode("aaaa \n")
		).to.deep.equal(
			{}
		);
		expect(
			decode("aaaa # asdad")
		).to.deep.equal(
			{}
		);
	});
	it("decodes the last entry even if it doesn't end in a newline", function() {
		expect(
			decode("hello world")
		).to.deep.equal({
			hello: "world"
		});
	});
	it("decodes multiple values", function() {
		expect(
			decode("hello world\nthank you")
		).to.deep.equal({
			hello: "world",
			thank: "you"
		});
	});
	it("guesses types", function() {
		expect(
			decode(
				"is_awsome yes\n" +
				"universe_is_infinite true\n" +
				"efficient_use_of_time no\n" +
				"is_not_awesome false\n" +
				"power_level 9001\n" +
				"some_float 420.69"
			)
		).to.deep.equal({
			is_awsome: true,
			universe_is_infinite: true,
			efficient_use_of_time: false,
			is_not_awesome: false,
			power_level: 9001,
			some_float: 420.69
		});
	});

	it("has nested properties", function() {
		expect(
			decode("qwertyuiop.asdfghjkl zxcvbnm")
		).to.deep.equal({
			qwertyuiop: {
				asdfghjkl: "zxcvbnm"
			}
		})
		expect(
			decode(
				"qwertyuiop.asdfghjkl zxcvbnm\n" +
				"qwertyuiop.lkjhgfdsa mnbvcxz"
			)
		).to.deep.equal({
			qwertyuiop: {
				asdfghjkl: "zxcvbnm",
				lkjhgfdsa: "mnbvcxz"
			}
		})
		expect(
			decode("qwertyuiop.asdfghjkl.zxcvbnm yes")
		).to.deep.equal({
			qwertyuiop: {
				asdfghjkl: {
					zxcvbnm: true
				}
			}
		})
	});
	it("creates a _root property if a nested property comes after a value", function() {
		expect(
			decode(
				"qwertyuiop.asdfghjkl zxcvbnm\n" +
				"qwertyuiop.asdfghjkl.zxcvbnm yes"
			)
		).to.deep.equal({
			qwertyuiop: {
				asdfghjkl: {
					_root: "zxcvbnm",
					zxcvbnm: true
				},
			}
		})
	});
	it("Ignores comments properly", function() {
		expect(
			decode(
				"# Some info test here\n" +
				"hello world # Hopefully this gets decoded"
			)
		).to.deep.equal({
			hello: "world"
		});
	});
	it("Ignores indentation", function() {
		expect(
			decode(
				"\t\t\t\t\thello world\n" +
				"          thank you"
			)
		).to.deep.equal({
			hello: "world",
			thank: "you"
		});
	});
	it("Ignores trailing whitespace", function() {
		expect(
			decode(
				"hello world\n\n\n" +
				"thank you     "
			)
		).to.deep.equal({
			hello: "world",
			thank: "you"
		});
	});
	it("has brackets", function() {
		expect(
			decode(
				"aaaa.{\n" +
				"hello world\n" +
				"thank you\n" +
				"}"
			)
		).to.deep.equal({
			aaaa: {
				hello: "world",
				thank: "you"
			}
		});
		expect(
			decode(
				"aaaa.{\n" +
				"  hello world\n" +
				"  thank you\n" +
				"}"
			)
		).to.deep.equal({
			aaaa: {
				hello: "world",
				thank: "you"
			}
		});
		expect(
			decode(
				"aaaa.{\n" +
				"  hello world\n" +
				"  thank you\n" +
				"}\n" +
				"aaaa.asdf true"
			)
		).to.deep.equal({
			aaaa: {
				hello: "world",
				thank: "you",
				asdf: true
			}
		});
	});
	it("doesn't have nested brackets", function() {
		expect(function(){
			decode(
				"aaaa.{\n" +
				"aaaa.{\n" +
				"hello world\n" +
				"thank you\n" +
				"}\n"+
				"}"
			)
		}).to.throw("Nested brackets aren't allowed")
	});
	it("has quotes nested properties so that you can have properties with spaces in them woo hoo", function() {
		expect(
			decode(
				"\"asdf# .\" hi"
			)
		).to.deep.equal({
			"asdf# .": "hi"
		});
	});
	it("handles comments in brackets", function() {
		expect(
			decode(
				"aaaa.{ #sdaasdad\n" +
				"hello world #sadsadadadad\n" +
				"thank you #awwww\n" +
				"}"
			)
		).to.deep.equal({
			aaaa: {
				hello: "world",
				thank: "you"
			}
		});
	});
	it("has arrays", function() {
		expect(
			decode(
				"aaaa.[\n" +
				"hello\n" +
				"world\n" +
				"yes\n" +
				"]"
			)
		).to.deep.equal({
			aaaa: [
				"hello",
				"world",
				true
			]
		});
	});
	it("handles comments in arrays", function() {
		expect(
			decode(
				"aaaa.[#aaaa\n" +
				"hello#bbb\n" +
				"world#ccc\n" +
				"yes#dd\n" +
				"]"
			)
		).to.deep.equal({
			aaaa: [
				"hello",
				"world",
				true
			]
		});
	});
	it("has arrays along with other stuff", function() {
		expect(
			decode(
				"aaaa.bbbb.[\n" +
				"hello\n" +
				"world\n" +
				"yes\n" +
				"]\n" +
				"\n" +
				"aaaa.cccc.{\n" +
				"hello world\n" +
				"thank you\n" +
				"}"
			)
		).to.deep.equal({
			aaaa: {
				bbbb: [
					"hello",
					"world",
					true
				],
				cccc: {
					hello: "world",
					thank: "you"
				}
			}
		});
	});
});