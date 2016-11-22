remerger
============================
Creates recursively memoized deep merge functions for use with react-redux connect

[![build status](https://secure.travis-ci.org/frankwallis/remerger.png?branch=master)](http://travis-ci.org/frankwallis/remerger)

## Usage ##
```
import createMerger from 'remerger';

@connect(mapStateToProps, mapDispatchToProps, createMerger())
class MyComponent extends React.Component {
   /* etc */  
}
```

## Why do I need this? ##

Consider the following code:

```
function mapStateToProps(state, props) {
    const component1Props = ...
    const component2Props = ...

    return {
        component1: component1Props,
        component2: component2Props
    }
}

function mapDispatchToProps(dispatch, props) {
    const component1Events = bindActionCreators(...)
    const component2Events = bindActionCreators(...)

    return {
        component1: component1Events,
        component2: component2Events
    }
}

@connect(mapStateToProps, mapDispatchToProps, createMerger())
class MyComponent extends React.Component {
    render() {
        const {component1, component2} = this.props;

        return (
            <div>
                <PureComponent1 {...component1} />
                <PureComponent2 {...component2} />
            </div>
        )
    }  
}
```

Using the default merge function provided by react-redux the props and events would not get merged at all as it uses Object.assign which would overwrite the props with the events for each component.  
Using a simple deep merge function would mean that the props and events get merged but each time subscribe fires MyComponent would receive new props and get rerendered.  
Using the memoized deep merge function provided by remerger, when subscribe fires and the props for PureComponent1 and PureComponent2 are unchanged, MyComponent will not be rerendered.
The memoization is also recursive so if there are further nested components receiving merged props and events then the same principle will apply. 