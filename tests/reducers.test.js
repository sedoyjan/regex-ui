import React from 'react'
import _ from 'lodash'
import {REGEX_BUILDER_ADD_RULE, REGEX_BUILDER_OPTION_CHANGE, REGEX_BUILDER_RESET} from 'src/builder/builder-actions'
import {REGEX_BUILDER_CHANGE_RULE, REGEX_BUILDER_REMOVE_RULE} from 'src/builder/rule-actions'
import {REGEX_TESTER_ADD_TEST, REGEX_TESTER_RESET} from 'src/tester/tester-actions'
import {REGEX_TESTER_CHANGE_TEST, REGEX_TESTER_REMOVE_TEST} from 'src/tester/test-actions'
import {REGEX_LOADER_LOAD, loadUrlValidationRegexAction, loadEmailValidationRegexAction} from 'src/loader/loader-actions'
import reducers from 'src/reducers'
import initState from 'src/state'

const cloneState  = (state) => {
    return JSON.parse(JSON.stringify(state))
}

describe('Initialization', () => {
    const action = {type: undefined}
    const output = reducers(undefined, action)

    it('must have regex as string', () => {
        expect(typeof output.regex).toEqual('string')
    })

    it('must have navigation as array', () => {
        expect(output.navigation instanceof Array).toBeTruthy()
    })

    it('must have builder as object', () => {
        expect(output.builder instanceof Object).toBeTruthy()
    })

    it('must have tester as object', () => {
        expect(output.tester instanceof Object).toBeTruthy()
    })
})

describe('Builder', () => {
    describe('Rule', () => {
        describe('Add', () => {
            const input = cloneState(initState)
            const nbInputRule = input.builder.rules.length
            const action = {type: REGEX_BUILDER_ADD_RULE}
            const output = reducers(input, action)

            it('have one more rule', () => {
                expect(output.builder.rules.length).toEqual(nbInputRule + 1)
            })
        })

        describe('Remove', () => {
            const input = cloneState(initState)
            input.builder.rules.push({identifier: 'foo'})
            const nbInputRule = input.builder.rules.length
            const action = {type: REGEX_BUILDER_REMOVE_RULE, rule_identifier: 'foo'}
            const output = reducers(input, action)

            it('have one less rule', () => {
                expect(output.builder.rules.length).toEqual(nbInputRule - 1)
            })

            it("doesn't contain removed rule", () => {
                _.each(output.builder.rules, (rule) => {
                    expect(rule.identifier).not.toEqual('foo')
                })
            })
        })

        describe('Change', () => {
            const input = cloneState(initState)
            input.builder.rules = [{identifier: 'foo', type: 'word', value: '', repeat_min: '', repeat_max: ''}]
            const action = {
                type: REGEX_BUILDER_CHANGE_RULE,
                rule_identifier: 'foo',
                rule_type: 'any',
                rule_value: 'a',
                rule_repeat_min: '1',
                rule_repeat_max: '2'
            }
            const output = reducers(input, action)

            it('must have type updated', () => {
                expect(output.builder.rules[0].type).toEqual(action.rule_type)
            })

            it('must have value updated', () => {
                expect(output.builder.rules[0].value).toEqual(action.rule_value)
            })

            it('must have minimum repeat updated', () => {
                expect(output.builder.rules[0].repeat_min).toEqual(action.rule_repeat_min)
            })

            it('must have maximun repeat updated', () => {
                expect(output.builder.rules[0].repeat_max).toEqual(action.rule_repeat_max)
            })
        })
    })

    describe('Option', () => {
        describe('Change', () => {
            const action = {type: REGEX_BUILDER_OPTION_CHANGE, option_name: 'foo'}

            it('must be activated', () => {
                const input = cloneState(initState)
                input.builder.options = [{name: 'foo', value: 'g', active: false}]
                expect(reducers(input, action).builder.options[0].active).toBeTruthy()
            })

            it('must be unactivated', () => {
                const input = cloneState(initState)
                input.builder.options = [{name: 'foo', value: 'g', active: true}]
                expect(reducers(input, action).builder.options[0].active).toBeFalsy()
            })
        })
    })

    describe('Reset', () => {
        const input = cloneState(initState)
        input.builder.rules.push({})
        const action = {type: REGEX_BUILDER_RESET}
        const output = reducers(input, action)

        it('have no rules', () => {
            expect(output.builder.rules.length).toEqual(0)
        })

        it('have no active option', () => {
            _.each(output.builder.options, (option) => {
                expect(option.active).toBeFalsy()
            })
        })
    })
})

describe('Tester', () => {
    describe('Test', () => {
        describe('Add', () => {
            const input = cloneState(initState)
            const nbInputTests = input.tester.tests.length
            const action = {type: REGEX_TESTER_ADD_TEST}
            const output = reducers(input, action)

            it('have one more test', () => {
                expect(output.tester.tests.length).toEqual(nbInputTests + 1)
            })
        })

        describe('Remove', () => {
            const input = cloneState(initState)
            input.tester.tests.push({identifier: 'foo'})
            const nbInputTests = input.tester.tests.length
            const action = {type: REGEX_TESTER_REMOVE_TEST, test_identifier: 'foo'}
            const output = reducers(input, action)

            it('have one less test', () => {
                expect(output.tester.tests.length).toEqual(nbInputTests - 1)
            })

            it("doesn't contain removed test", () => {
                _.each(output.tester.tests, (test) => {
                    expect(test.identifier).not.toEqual('foo')
                })
            })
        })

        describe('Change', () => {
            const input = cloneState(initState)
            input.tester.tests = [{ identifier: 'foo', subject: '123', must_match: false }]

            const action = {
                type: REGEX_TESTER_CHANGE_TEST,
                test_identifier: 'foo',
                test_subject: '456',
                test_must_match: true
            }

            const output = reducers(input, action)

            it('must have subject updated', () => {
                expect(output.tester.tests[0].subject).toEqual(action.test_subject)
            })

            it('must have match updated', () => {
                expect(output.tester.tests[0].must_match).toEqual(action.test_must_match)
            })
        })
    })

    describe('Reset', () => {
        const input = cloneState(initState)
        input.tester.tests.push({})
        const action = {type: REGEX_TESTER_RESET}
        const output = reducers(input, action)

        it('have no tests', () => {
            expect(output.tester.tests.length).toEqual(0)
        })
    })
})

describe('Loader', () => {
    describe('Url validation', () => {
        const output = reducers(undefined, loadUrlValidationRegexAction)

        it('must have valid options', () => {
            expect(output.builder.options.length).toEqual(initState.builder.options.length)
            _.each(output.builder.options, (option, i) => {
                expect(_.assign({}, option, initState.builder.options[i]).length).toEqual(initState.builder.options[i].length)
            })
        })

        it('must have rules', () => {
            expect(output.builder.rules.length > 0).toBeTruthy()
        })
    })

    describe('Email validation', () => {
        const output = reducers(undefined, loadEmailValidationRegexAction)

        it('must have valid options', () => {
            expect(output.builder.options.length).toEqual(initState.builder.options.length)
            _.each(output.builder.options, (option, i) => {
                expect(_.assign({}, option, initState.builder.options[i]).length).toEqual(initState.builder.options[i].length)
            })
        })

        it('must have rules', () => {
            expect(output.builder.rules.length > 0).toBeTruthy()
        })
    })
})