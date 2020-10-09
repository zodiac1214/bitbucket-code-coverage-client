# NOTE

This is a fork from https://bitbucket.org/atlassian/code-coverage-client/src/master/. The original package has not been updated for couple of years. this is a republish.

# Code Coverage client

Node.js client for [bitbucket-code-coverage](https://bitbucket.org/atlassian/bitbucket-code-coverage)

## Installation

```bash
yarn global add bitbucket-code-coverage-client
```

## Usage

You need a Personal Auth Token to use this client. Read the [documentation](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html#Personalaccesstokens-Generatingpersonalaccesstokens) to find out how to generate one.

```txt
  Usage: code-coverage-client [options]

  Options:

    -V, --version          output the version number
    --url <url>            Bitbucket URL
    --auth <auth>          Personal Access Token
    --commit <commit>      Commit id
    --file <file>          LCOV file
    --debug                (Optional) Enable debug mode
    --basePath <basePath>  (Optional) Path prefix to remove from LCOV paths, defaults to current directory
    -h, --help             output usage information

Example:

code-coverage-client \
    --url https://stash.atlassian.com \
    --auth <auth token> \
    --commit 95d2c4677dd6f40ef8954736b001e25f9939fa68 \
    --file /Users/scinos/src/JIRA/FE/jira-frontend/test-reports/coverage/lcov.info \
    --basePath /Users/scinos/src/JIRA/FE/jira-frontend/
```

## Contributors

Pull requests, issues and comments welcome. For pull requests:

* Add tests for new features and bug fixes
* Follow the existing style
* Separate unrelated changes into multiple pull requests

Test your changes locally before creating pull request. To run tests

```bash
yarn test
```

See the existing issues for things to start contributing.

For bigger changes, make sure you start a discussion first by creating
an issue and explaining the intended change.

Atlassian requires contributors to sign a Contributor License Agreement,
known as a CLA. This serves as a record stating that the contributor is
entitled to contribute the code/documentation/translation to the project
and is willing to have it used in distributions and derivative works
(or is willing to transfer ownership).

Prior to accepting your contributions we ask that you please follow the appropriate
link below to digitally sign the CLA. The Corporate CLA is for those who are
contributing as a member of an organization and the individual CLA is for
those contributing as an individual.

* [CLA for corporate contributors](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=e1c17c66-ca4d-4aab-a953-2c231af4a20b)
* [CLA for individuals](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=3f94fbdc-2fbe-46ac-b14c-5d152700ae5d)

## License

Copyright (c) 2017 Atlassian and others.
Apache 2.0 licensed, see [LICENSE.txt](LICENSE.txt) file.