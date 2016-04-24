const expect = require('chai').expect;
const createMerger = require('./index');
const remerge = createMerger();

describe('remerge', () => {
   it('merges state and actions', () => {
      const state = {
         prop1: 'aardvark',
         prop2: 'zebra'
      };
      const actions = {
         feed: () => console.log('yum'),
         groom: () => console.log('neigh')
      }
      const merged = remerge(state, actions);
      expect(merged.prop1).to.equal(state.prop1);
      expect(merged.prop2).to.equal(state.prop2);
      expect(merged.feed).to.equal(actions.feed);
      expect(merged.groom).to.equal(actions.groom);
   });

   it('returns the same object when inputs are unchanged', () => {
      const state = {
         prop1: 'aardvark',
         prop2: 'zebra'
      };
      const actions = {
         feed: () => console.log('yum'),
         groom: () => console.log('neigh')
      }
      const merged1 = remerge(state, actions);
      const merged2 = remerge(state, actions);      
      expect(merged1).to.equal(merged2);      
   });
   
   it('returns different object when inputs are changed', () => {
      const state = {
         prop1: 'aardvark',
         prop2: 'zebra'
      };
      const actions = {
         feed: () => console.log('yum'),
         groom: () => console.log('neigh')
      };
      const actions2 = {
         feed: () => console.log('yuk'),
         groom: () => console.log('grrr')
      };
      const merged1 = remerge(state, actions);
      const merged2 = remerge(state, actions2);
      expect(merged1).to.not.equal(merged2);
   });

   it('performs a deep merge of the objects', () => {
      const state = {
         aardvark: {
            color: 'brown'
         },
         zebra: {
            color: 'stripey'
         }        
      };
      const actions = {
         aardvark: {
            feed: () => console.log('yum'),   
         },
         zebra: {
            groom: () => console.log('neigh')   
         }                 
      }
      const merged1 = remerge(state, actions);
      const merged2 = remerge(state, actions);      
      expect(merged1).to.equal(merged2);
      
      expect(merged1.aardvark.color).to.be.equal(state.aardvark.color);
      expect(merged1.aardvark.feed).to.be.equal(actions.aardvark.feed);
      expect(merged1.zebra.color).to.be.equal(state.zebra.color);    
      expect(merged1.aardvark.groom).to.be.equal(actions.aardvark.groom);
   });

   it('does not modify original objects', () => {
      const state = {
         prop1: 'aardvark',
         prop2: 'zebra'
      };
      const actions = {
         feed: () => console.log('yum'),
         groom: () => console.log('neigh')
      }
      Object.freeze(state);
      Object.freeze(actions);
      const merged1 = remerge(state, actions);
      expect(merged1).to.not.equal(state);   
   });

   it('returns same object for 1st level nested parts of the merged object which are unchanged', () => {
      const state = {
         aardvark: {
            color: 'brown'
         },
         zebra: {
            color: 'stripey'
         }        
      };
      const actions = {
         aardvark: {
            feed: () => console.log('yum'),   
         },
         zebra: {
            groom: () => console.log('neigh')   
         }                 
      }
      const actions2 = {
         aardvark: {
            feed: () => console.log('yuk'),   
         },
         zebra: actions.zebra
      }
      const merged1 = remerge(state, actions);
      const merged2 = remerge(state, actions2);      
      expect(merged1).to.not.equal(merged2);
      expect(merged1.aardvark).to.not.equal(merged2.aardvark);
      expect(merged1.zebra).to.be.equal(merged2.zebra);
   });

   it('returns same object for 2nd level nested parts of the merged object which are unchanged', () => {
      const state = {
         animals: {
            aardvark: {
               color: 'brown'
            },
            zebra: {
               color: 'stripey'
            }
         }        
      };
      const actions = {
         animals: {
            aardvark: {
               feed: () => console.log('yum'),   
            },
            zebra: {
               groom: () => console.log('neigh')   
            }
         }                 
      }
      const actions2 = {
         animals: {
            aardvark: {
               feed: () => console.log('yuk'),   
            },
            zebra: actions.animals.zebra
         }
      }
      const merged1 = remerge(state, actions);
      const merged2 = remerge(state, actions2);      
      expect(merged1).to.not.equal(merged2);
      expect(merged1.animals).to.not.equal(merged2.animals);
      expect(merged1.animals.aardvark).to.not.equal(merged2.animals.aardvark);
      expect(merged1.animals.zebra).to.be.equal(merged2.animals.zebra);
   });
   
   it('handles undefined values', () => {
      const merged = remerge(undefined, undefined);
      expect(merged).to.deep.equal({});
   });

   it('handles arrays', () => {
      const state = {
         arr1: ['aardvark', 'antelope'],
         arr2: ['zebra', 'zebu']
      };
      const actions = {
         feed: () => console.log('yum'),
         groom: () => console.log('neigh')
      }
      const merged = remerge(state, actions);
      expect(merged.arr1).to.equal(state.arr1);
      expect(merged.arr2).to.equal(state.arr2);
      expect(merged.feed).to.equal(actions.feed);
      expect(merged.groom).to.equal(actions.groom);
   });

   it('if conflicting values are not objects, action wins', () => {
      const state = {
         prop1: ['aardvark', 'antelope'],
         prop2: 'zebra'
      };
      const actions = {
         prop1: () => console.log('yum'),
         prop2: () => console.log('neigh')
      }
      const merged = remerge(state, actions);
      expect(merged.prop1).to.equal(actions.prop1);
      expect(merged.prop2).to.equal(actions.prop2);
   });
   
});