const parseLcov = require('../src/lib/parseLcov');
const outdent = require('outdent');
const expect = require('chai').expect;

describe("LCOV parser", () => {
    it("Extracts the file name", () => {
        const lcov = outdent`
        TN:
        SF:file.txt
        DA:1,0
        end_of_record
        `
        expect(parseLcov(lcov).files[0]).to.have.property('path', 'file.txt');
    });

    it("Makes the filename relative", () => {
        const lcov = outdent`
        TN:
        SF:/a/b/c/file.txt
        DA:1,0
        end_of_record
        `
        expect(parseLcov(lcov, "/a/b").files[0]).to.have.property('path', 'c/file.txt');
    });

    it("Detects uncovered lines as uncovered", () => {
        const lcov = outdent`
        TN:
        SF:/a/b/c/file.txt
        DA:1,0
        end_of_record
        `
        expect(parseLcov(lcov).files[0]).to.have.property('coverage', 'C:;P:;U:1');
    });

    it("Detects lines with some branches uncovered as partial", () => {
        const lcov = outdent`
        TN:
        SF:/a/b/c/file.txt
        DA:1,1
        BRDA:1,0,0,0
        BRDA:1,0,1,1
        end_of_record
        `
        expect(parseLcov(lcov).files[0]).to.have.property('coverage', 'C:;P:1;U:');
    });

    it("Detects lines with some functions uncovered as partial", () => {
        const lcov = outdent`
        TN:
        SF:/a/b/c/file.txt
        DA:1,1
        FN:1,(anonymous_0)
        FN:1,(anonymous_1)
        FNDA:0,(anonymous_0)
        FNDA:1,(anonymous_1)
        end_of_record
        `
        expect(parseLcov(lcov).files[0]).to.have.property('coverage', 'C:;P:1;U:');
    });

    it("Detects lines with all branches covered as covered", () => {
        const lcov = outdent`
        TN:
        SF:/a/b/c/file.txt
        DA:1,1
        BRDA:1,0,0,1
        BRDA:1,0,1,1
        end_of_record
        `
        expect(parseLcov(lcov).files[0]).to.have.property('coverage', 'C:1;P:;U:');
    });

    it("Detects lines with all functions covered as covered", () => {
        const lcov = outdent`
        TN:
        SF:/a/b/c/file.txt
        DA:1,1
        FN:1,(anonymous_0)
        FN:1,(anonymous_1)
        FNDA:1,(anonymous_0)
        FNDA:1,(anonymous_1)
        end_of_record
        `
        expect(parseLcov(lcov).files[0]).to.have.property('coverage', 'C:1;P:;U:');
    });

    it("Detects the status of multiple lines", () => {
        // Lines 1 and 2 are covered
        // Line 3 is partial because some functions are not covered
        // Line 4 is partial because some branches are not covered
        // LInes 5 and 6 are uncovered
        const lcov = outdent`
        TN:
        SF:/a/b/c/file.txt
        DA:1,1
        DA:2,1
        DA:3,1
        DA:4,1
        DA:5,0
        DA:6,0
        FN:3,(anonymous_0)
        FNDA:0,(anonymous_0)
        BRDA:4,0,0,1
        BRDA:4,0,1,0
        end_of_record
        `

        expect(parseLcov(lcov).files[0]).to.have.property('coverage', 'C:1,2;P:3,4;U:5,6');
    })

    it("Detects the status of multiple files", () => {
        // File 1 is covered
        // File 2 is uncovered
        // File 3 is partially covered
        const lcov = outdent`
        TN:
        SF:/a/b/c/file1.txt
        DA:1,1
        end_of_record
        SF:/a/b/c/file2.txt
        DA:1,0
        end_of_record
        SF:/a/b/c/file3.txt
        DA:1,1
        BRDA:1,0,0,0
        end_of_record
        `
        expect(parseLcov(lcov, "/a/b/c/")).to.deep.equal({
            files: [
                {
                    path: 'file1.txt',
                    coverage: 'C:1;P:;U:'
                },
                {
                    path: 'file2.txt',
                    coverage: 'C:;P:;U:1'
                },
                {
                    path: 'file3.txt',
                    coverage: 'C:;P:1;U:'
                }
            ]
        })
    })

    it("Omits empty files with no coverage", () => {
        // File 1 is covered
        // File 2 is uncovered
        // File 3 is partially covered
        const lcov = outdent`
        TN:
        SF:/a/b/c/file1.txt
        DA:1,1
        end_of_record
        SF:/a/b/c/file2.txt
        end_of_record
        `
        expect(parseLcov(lcov, "/a/b/c/")).to.deep.equal({
            files: [
                {
                    path: 'file1.txt',
                    coverage: 'C:1;P:;U:'
                }
            ]
        })
    })

})