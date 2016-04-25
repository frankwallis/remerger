const expect = require('chai').expect;
const createMerger = require('./index');
const remerge = createMerger();

describe('remerge', () => {
   it('merges state, actions and props', () => {
      const state = {
         prop1: 'aardvark',
         prop2: 'zebra'
      };
      const actions = {
         feed: () => console.log('yum'),
         groom: () => console.log('neigh')
      }
      const props = {
         display: 'list',
         items: 10
      }
      const merged = remerge(state, actions, props);
      expect(merged.prop1).to.equal(state.prop1);
      expect(merged.prop2).to.equal(state.prop2);
      expect(merged.feed).to.equal(actions.feed);
      expect(merged.groom).to.equal(actions.groom);
      expect(merged.display).to.equal(props.display);
      expect(merged.items).to.equal(props.items);
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
      const props = {
         display: 'list',
         items: 10
      }
      const merged1 = remerge(state, actions, props);
      const merged2 = remerge(state, actions, props);      
      expect(merged1).to.equal(merged2);      
   });
   
   it('returns different object when actions are changed', () => {
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
      const props = {
         display: 'list',
         items: 10
      }
      const merged1 = remerge(state, actions, props);
      const merged2 = remerge(state, actions2, props);
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
      const props = {
         aardvark: {
            display: 'list'
         },
         zebra: {
            display: 'grid'
         }
      }
      const merged1 = remerge(state, actions, props);
      const merged2 = remerge(state, actions, props);      
      expect(merged1).to.equal(merged2);
      
      expect(merged1.aardvark.color).to.be.equal(state.aardvark.color);
      expect(merged1.aardvark.feed).to.be.equal(actions.aardvark.feed);
      expect(merged1.aardvark.display).to.be.equal(props.aardvark.display);
      expect(merged1.zebra.color).to.be.equal(state.zebra.color);    
      expect(merged1.aardvark.groom).to.be.equal(actions.aardvark.groom);
      expect(merged1.zebra.display).to.be.equal(props.zebra.display);
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

   it('does not modify original objects when nested', () => {
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
      Object.freeze(state);
      Object.freeze(actions);
      const merged = remerge(state, actions);
      expect(merged).to.not.equal(state);   
      expect(merged.aardvark).to.not.equal(state.aardvark);
      expect(merged.zebra).to.not.equal(state.zebra);   
      expect(merged.aardvark).to.not.equal(actions.aardvark);
      expect(merged.zebra).to.not.equal(actions.zebra);   
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
      const props = {
         aardvark: {
            display: 'list'
         },
         zebra: {
            display: 'grid'
         }
      }
      const merged1 = remerge(state, actions, props);
      const merged2 = remerge(state, actions2, props);      
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
      const props = {
         animals: {
            aardvark: {
               display: 'list'
            },
            zebra: {
               display: 'grid'
            }
         }
      }
      const merged1 = remerge(state, actions, props);
      const merged2 = remerge(state, actions2, props);      
      expect(merged1).to.not.equal(merged2);
      expect(merged1.animals).to.not.equal(merged2.animals);
      expect(merged1.animals.aardvark).to.not.equal(merged2.animals.aardvark);
      expect(merged1.animals.zebra).to.be.equal(merged2.animals.zebra);
   });
   
   it('handles undefined values', () => {
      const merged = remerge(undefined, undefined, undefined);
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

   it('if conflicting values are not objects, props wins, actions 2nd', () => {
      const state = {
         prop1: ['aardvark', 'antelope'],
         prop2: 'zebra'
      };
      const actions = {
         prop1: () => console.log('yum'),
         prop2: () => console.log('neigh')
      }
      const props = {
         prop1: 10,
         prop9: 'zebra'
      };
      const merged = remerge(state, actions, props);
      expect(merged.prop1).to.equal(props.prop1);
      expect(merged.prop2).to.equal(actions.prop2);
   });
   
});