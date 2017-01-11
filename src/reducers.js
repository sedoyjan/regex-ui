import regexBuilder from './builder/builder-service';
import initialState from './state';

const reducers = (state = initialState, action) => {

    if('REGEX_LOADER_LOAD' == action.type)
    {
        state.builder.options = action.regex_options;
        state.builder.rules = action.regex_rules;
        state.builder.next_identifier = action.next_identifier;
        state.tester.tests = action.regex_tests;
    }

    if('REGEX_BUILDER_RESET_RULES' == action.type)
    {
        state.builder.options = state.builder.options.map(function(option) {
            return Object.assign({}, option, { 'active': false });
        });

        state.builder.rules = [];
    }

    if('REGEX_BUILDER_OPTION_CHANGE' == action.type)
    {
        state.builder.options = state.builder.options.map(function(option) {
            if(option.name === action.option_name) {
                return Object.assign({}, option, {
                    'active': !option.active
                });
            }

            return option;
        });
    }

    if('REGEX_BUILDER_REMOVE_RULE' == action.type)
    {
        state.builder.rules = state.builder.rules.filter(function(rule) {
            return rule.identifier !== action.rule_identifier;
        });
    }

    if('REGEX_BUILDER_ADD_RULE' == action.type)
    {
        state.builder.rules = state.builder.rules.concat([{
            identifier: ++state.builder.next_identifier,
            type: state.builder.default_type,
            value: ''
        }]);
    }

    if('REGEX_BUILDER_CHANGE_RULE' == action.type)
    {
        state.builder.rules = state.builder.rules.map(function(rule) {
            if(rule.identifier === action.rule_identifier) {
                return Object.assign({}, rule, {
                    'type': action.rule_type,
                    'value': action.rule_value
                });
            }

            return rule;
        });
    }

    const regex = regexBuilder(state.builder);

    state.tester.tests = state.tester.tests.map(function(test) {
        return Object.assign({}, test, {
            'match': regex.test(test.subject)
        });
    });

    return Object.assign({}, state, {
        'regex': regex.toString(),
    });
};

export default reducers;