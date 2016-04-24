var expect = require('chai').expect;
var createMerger = require('./index');
var remerge = createMerger();
describe('remerge', function () {
    it('merges state and actions', function () {
        var state = {
            prop1: 'aardvark',
            prop2: 'zebra'
        };
        var actions = {
            feed: function () { return console.log('yum'); },
            groom: function () { return console.log('neigh'); }
        };
        var merged = remerge(state, actions);
        expect(merged.prop1).to.equal(state.prop1);
        expect(merged.prop2).to.equal(state.prop2);
        expect(merged.feed).to.equal(actions.feed);
        expect(merged.groom).to.equal(actions.groom);
    });
    it('returns the same object when inputs are unchanged', function () {
        var state = {
            prop1: 'aardvark',
            prop2: 'zebra'
        };
        var actions = {
            feed: function () { return console.log('yum'); },
            groom: function () { return console.log('neigh'); }
        };
        var merged1 = remerge(state, actions);
        var merged2 = remerge(state, actions);
        expect(merged1).to.equal(merged2);
    });
    it('returns different object when inputs are changed', function () {
        var state = {
            prop1: 'aardvark',
            prop2: 'zebra'
        };
        var actions = {
            feed: function () { return console.log('yum'); },
            groom: function () { return console.log('neigh'); }
        };
        var actions2 = {
            feed: function () { return console.log('yuk'); },
            groom: function () { return console.log('grrr'); }
        };
        var merged1 = remerge(state, actions);
        var merged2 = remerge(state, actions2);
        expect(merged1).to.not.equal(merged2);
    });
    it('performs a deep merge of the objects', function () {
        var state = {
            aardvark: {
                color: 'brown'
            },
            zebra: {
                color: 'stripey'
            }
        };
        var actions = {
            aardvark: {
                feed: function () { return console.log('yum'); },
            },
            zebra: {
                groom: function () { return console.log('neigh'); }
            }
        };
        var merged1 = remerge(state, actions);
        var merged2 = remerge(state, actions);
        expect(merged1).to.equal(merged2);
        expect(merged1.aardvark.color).to.be.equal(state.aardvark.color);
        expect(merged1.aardvark.feed).to.be.equal(actions.aardvark.feed);
        expect(merged1.zebra.color).to.be.equal(state.zebra.color);
        expect(merged1.aardvark.groom).to.be.equal(actions.aardvark.groom);
    });
    it('does not modify original objects', function () {
        var state = {
            prop1: 'aardvark',
            prop2: 'zebra'
        };
        var actions = {
            feed: function () { return console.log('yum'); },
            groom: function () { return console.log('neigh'); }
        };
        Object.freeze(state);
        Object.freeze(actions);
        var merged1 = remerge(state, actions);
        expect(merged1).to.not.equal(state);
    });
    it('returns same object for 1st level nested parts of the merged object which are unchanged', function () {
        var state = {
            aardvark: {
                color: 'brown'
            },
            zebra: {
                color: 'stripey'
            }
        };
        var actions = {
            aardvark: {
                feed: function () { return console.log('yum'); },
            },
            zebra: {
                groom: function () { return console.log('neigh'); }
            }
        };
        var actions2 = {
            aardvark: {
                feed: function () { return console.log('yuk'); },
            },
            zebra: actions.zebra
        };
        var merged1 = remerge(state, actions);
        var merged2 = remerge(state, actions2);
        expect(merged1).to.not.equal(merged2);
        expect(merged1.aardvark).to.not.equal(merged2.aardvark);
        expect(merged1.zebra).to.be.equal(merged2.zebra);
    });
    it('returns same object for 2nd level nested parts of the merged object which are unchanged', function () {
        var state = {
            animals: {
                aardvark: {
                    color: 'brown'
                },
                zebra: {
                    color: 'stripey'
                }
            }
        };
        var actions = {
            animals: {
                aardvark: {
                    feed: function () { return console.log('yum'); },
                },
                zebra: {
                    groom: function () { return console.log('neigh'); }
                }
            }
        };
        var actions2 = {
            animals: {
                aardvark: {
                    feed: function () { return console.log('yuk'); },
                },
                zebra: actions.animals.zebra
            }
        };
        var merged1 = remerge(state, actions);
        var merged2 = remerge(state, actions2);
        expect(merged1).to.not.equal(merged2);
        expect(merged1.animals).to.not.equal(merged2.animals);
        expect(merged1.animals.aardvark).to.not.equal(merged2.animals.aardvark);
        expect(merged1.animals.zebra).to.be.equal(merged2.animals.zebra);
    });
});
