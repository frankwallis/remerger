remerger
============================
Creates memoizing deep merge functions for use with react-redux connect

[![build status](https://secure.travis-ci.org/frankwallis/remerger.png?branch=master)](http://travis-ci.org/frankwallis/remerger)

## Usage ##
```
import createMerger from 'remerger';

@connect(mapStateToProps, mapDispatchToProps, createMerger())
class MyComponent extends React.Component {
   /* etc */  
}
```