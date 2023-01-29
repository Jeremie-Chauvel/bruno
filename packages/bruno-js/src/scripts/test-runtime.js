const { NodeVM } = require('vm2');
const chai = require('chai');  
const path = require('path');
const Bru = require('./bru');
const BrunoRequest = require('./bruno-request');
const BrunoResponse = require('./bruno-response');
const Test = require('./test');
const TestResults = require('./test-results');

class TestRuntime {
  constructor() {
  }

  runTests(testsFile, request, response, environment, collectionPath) {
    const bru = new Bru(environment);
    const req = new BrunoRequest(request);
    const res = new BrunoResponse(response);

    const __brunoTestResults = new TestResults();
    const test = Test(__brunoTestResults, chai);

    const context = {
      bru,
      req,
      res,
      test,
      expect: chai.expect,
      assert: chai.assert,
      __brunoTestResults: __brunoTestResults
    };

    const vm = new NodeVM({
      sandbox: context,
      require: {
        context: 'sandbox',
        external: true,
        root: [collectionPath]
      }
    });
    console.log(__brunoTestResults);

    vm.run(testsFile, path.join(collectionPath, 'vm.js'));

    return {
      request,
      response,
      environment,
      results: __brunoTestResults.getResults()
    };
  }
}

module.exports = {
  TestRuntime
};