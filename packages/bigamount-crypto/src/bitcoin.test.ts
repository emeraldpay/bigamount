import {Satoshi} from "./bitcoin";

describe("Satoshi", () => {
    describe("create", () => {
        it("from bitcoin shortcut", () => {
            let value = Satoshi.fromBitcoin(1.23);
            expect(value.number.toFixed()).toBe("123000000");
        });
    });

    describe("toBitcoin", () => {
        it("zero", () => {
            expect(
                Satoshi.ZERO.toBitcoin()
            ).toBe(0);
        });

        it("one", () => {
            expect(
                new Satoshi("100000000").toBitcoin()
            ).toBe(1);
        });

        it("decimal", () => {
            expect(
                new Satoshi("123400000").toBitcoin()
            ).toBe(1.234);
        });
    });

    describe("encoding", () => {
        it("decode encoder", () => {
            [119, 7194, 1291854, 13084, 7453181, 65, 756921399].forEach((n) => {
                let orig = new Satoshi(n);
                let encoded = orig.encode();
                let decoded = Satoshi.decode(encoded);
                expect(orig.equals(decoded)).toBeTruthy();
                expect(Satoshi.is(decoded)).toBeTruthy();
            })
        });

        it("encode", () => {
            let value = Satoshi.fromBitcoin(1.23);
            expect(value.encode()).toBe("123000000/SAT");
        });

        it("decode", () => {
            let value = Satoshi.decode("123000000/SAT");
            expect(value.number.toFixed()).toBe("123000000");
        })
    });

    describe("operations returns Satoishi", () => {
        let act = Satoshi.ZERO.plus(Satoshi.ZERO);
        expect(
            act.isSame(Satoshi.ZERO)
        ).toBeTruthy();
        expect(
            Satoshi.is(act)
        ).toBeTruthy();
    });

})