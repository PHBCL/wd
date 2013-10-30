require('../helpers/setup');

describe('keying ' + env.ENV_DESC, function() {

  var ctx = require('./midway-base')(this),
      express = ctx.express,
      browser;
  ctx.browser.then(function(_browser) { browser = _browser; });

  var altKey = wd.SPECIAL_KEYS.Alt;
  var nullKey = wd.SPECIAL_KEYS.NULL;
  var returnKey = wd.SPECIAL_KEYS.Return;
  var enterKey = wd.SPECIAL_KEYS.Enter;

  var typingPartial =
    '<div id="theDiv">\n' +
    '<input></input>\n' +
    '<textarea></textarea>\n' +
    '</div>\n';

  express.partials['typing nothing'] = typingPartial;
  it('typing nothing', function() {
    return browser
      .elementByCss("#theDiv input").type("").getValue().should.become("")
      .elementByCss("#theDiv textarea").type("").getValue().should.become("");
  });

  express.partials['typing []'] = typingPartial;
  it('typing []', function() {
    return browser
      .elementByCss("#theDiv input").type([]).getValue().should.become("")
      .elementByCss("#theDiv textarea").type([]).getValue().should.become("");
  });

  express.partials['typing \'Hello\''] = typingPartial;
  it('typing \'Hello\'', function() {
    return browser
      .elementByCss("#theDiv input").type('Hello')
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type('Hello')
        .getValue().should.become('Hello');
  });

  express.partials['typing [\'Hello\']'] = typingPartial;
  it('typing [\'Hello\']', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello']).getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello']).getValue().should.become('Hello');
  });

  express.partials['typing [\'Hello\',\' \',\'World\',\'!\']'] = typingPartial;
  it('typing [\'Hello\',\' \',\'World\',\'!\']', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', ' ', 'World', '!'])
        .getValue().should.become('Hello World!')
      .elementByCss("#theDiv textarea").type(['Hello', ' ', 'World', '!'])
        .getValue().should.become('Hello World!');
  });

  express.partials['typing \'Hello\\n\''] = typingPartial;
  it('typing \'Hello\\n\'', function() {
    return browser
      .elementByCss("#theDiv input").type('Hello\n')
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type('Hello\n')
        .getValue().should.become('Hello\n');
  });

  express.partials['typing \'\\r\''] = typingPartial;
  it('typing \'\\r\'', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello','\r'])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello','\r'])
        .getValue().should.become( env.DESIRED.browserName === 'firefox'?
          'Hello\n': 'Hello');
  });

  express.partials['typing [returnKey]'] = typingPartial;
  it('typing [returnKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', returnKey])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello', returnKey])
        .getValue().should.become('Hello\n');
  });

  express.partials['typing [enterKey]'] = typingPartial;
  it('typing [enterKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', enterKey])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello', enterKey])
        .getValue().should.become('Hello\n');
  });

  express.partials['typing [nullKey]'] = typingPartial;
  it('typing [nullKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', nullKey])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello', nullKey])
        .getValue().should.become('Hello');
  });


  if(!env.SAUCE) { // alt key seems to have no effect
    express.partials['typing [altKey]'] = typingPartial;
    it('typing [altKey]', function() {
      return browser
        .elementByCss("#theDiv input").type([altKey, 'Hello', altKey])
          .getValue().then(function(val) {
            val.should.exist;
            val.should.not.equal('Hello');
          })
        .elementByCss("#theDiv textarea").type([altKey, 'Hello', altKey])
          .getValue().then(function(val) {
            val.should.exist;
            val.should.not.equal('Hello');
          });
    });
  }

});
